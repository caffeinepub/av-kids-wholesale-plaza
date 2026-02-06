import Array "mo:core/Array";
import Time "mo:core/Time";
import Set "mo:core/Set";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  /****************************************
   *        Authorization System          *
   ****************************************/
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  /****************************************
   *           User Profile Types         *
   ****************************************/
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  /****************************************
   *         User Profile Functions       *
   ****************************************/
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /****************************************
   *             Product Types            *
   ****************************************/
  type ProductId = Nat;

  type Product = {
    id : ProductId;
    name : Text;
    price : Nat;
    image : Text;
    description : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  /****************************************
   *            Order Types               *
   ****************************************/
  type OrderId = Nat;

  type OrderItem = {
    productId : ProductId;
    quantity : Nat;
    unitPriceAtOrder : Nat;
  };

  type CustomerDetails = {
    name : Text;
    phone : Text;
    email : Text;
    fullAddress : Text;
  };

  type Order = {
    id : OrderId;
    items : [OrderItem];
    totalEstimate : Nat;
    customer : CustomerDetails;
    createdAt : Int;
  };

  /****************************************
   *            Persistent Storage        *
   ****************************************/
  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, Order>();
  let deletedProducts = Set.empty<ProductId>();

  /****************************************
   *             Initialization           *
   ****************************************/
  var nextProductId : ProductId = 1;
  var nextOrderId : OrderId = 1;

  /****************************************
   *             Product CRUD             *
   ****************************************/
  // Admin-only: Add new product
  public shared ({ caller }) func addProduct(name : Text, price : Nat, image : Text, description : Text) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let productId = nextProductId;
    nextProductId += 1;
    let timestamp = Time.now();
    let product : Product = {
      id = productId;
      name;
      price;
      image;
      description;
      createdAt = timestamp;
      updatedAt = timestamp;
    };
    products.add(productId, product);
    productId;
  };

  // Admin-only: Update existing product
  public shared ({ caller }) func updateProduct(id : ProductId, name : Text, price : Nat, image : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existing) {
        let updatedProduct : Product = {
          id;
          name;
          price;
          image;
          description;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        products.add(id, updatedProduct);
      };
    };
  };

  // Admin-only: Delete product (soft delete)
  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    deletedProducts.add(id);
  };

  // Public: Get all active products (guests can browse)
  public query func getProducts() : async [Product] {
    products.values().toArray().filter(func(p) { not deletedProducts.contains(p.id) });
  };

  // Public: Get single product by ID (guests can view)
  public query func getProduct(id : ProductId) : async Product {
    if (deletedProducts.contains(id)) {
      Runtime.trap("Product not found");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  /****************************************
   *            Order Placement           *
   ****************************************/
  // Public: Place order (guests can checkout without authentication)
  public shared ({ caller }) func placeOrder(items : [OrderItem], customer : CustomerDetails) : async OrderId {
    let validItems : List.List<OrderItem> = List.empty<OrderItem>();
    var totalEstimate = 0;

    for (item in items.values()) {
      if (not deletedProducts.contains(item.productId)) {
        switch (products.get(item.productId)) {
          case (null) {};
          case (?product) {
            let validItem : OrderItem = {
              productId = item.productId;
              quantity = item.quantity;
              unitPriceAtOrder = product.price;
            };
            validItems.add(validItem);
            totalEstimate += product.price * item.quantity;
          };
        };
      };
    };

    let orderId = nextOrderId;
    nextOrderId += 1;
    let order : Order = {
      id = orderId;
      items = validItems.toArray();
      totalEstimate;
      customer;
      createdAt = Time.now();
    };
    orders.add(orderId, order);
    orderId;
  };

  /****************************************
   *           Admin Order Review         *
   ****************************************/
  // Admin-only: View all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };

    orders.values().toArray().sort(
      func(a, b) {
        Int.compare(a.createdAt, b.createdAt);
      }
    );
  };
};
