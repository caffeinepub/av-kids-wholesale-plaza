export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        <img
          src="/assets/generated/shop-hero.dim_1600x600.png"
          alt="Av Kids Wholesale Plaza"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground drop-shadow-lg">
              Welcome to Av Kids Wholesale Plaza
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 drop-shadow-md">
              Your trusted source for quality kids products at wholesale prices
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
