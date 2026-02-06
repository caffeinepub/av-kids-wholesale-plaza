import { Heart, Phone, MessageCircle } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';
import { Link } from '@tanstack/react-router';
import { BUSINESS_CONTACT } from '../../config/businessContact';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${BUSINESS_CONTACT.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {BUSINESS_CONTACT.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`https://wa.me/${BUSINESS_CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp: {BUSINESS_CONTACT.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <SiInstagram className="h-4 w-4 text-muted-foreground" />
                <a
                  href={BUSINESS_CONTACT.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {BUSINESS_CONTACT.instagram.handle}
                </a>
              </div>
              {BUSINESS_CONTACT.address && (
                <div className="pt-2">
                  <p className="text-muted-foreground">{BUSINESS_CONTACT.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <div>
                <Link
                  to="/"
                  className="hover:text-primary transition-colors"
                >
                  Catalog
                </Link>
              </div>
              <div>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Av Kids Wholesale Plaza</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted source for wholesale kids products. Quality products at competitive prices.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t text-center text-sm text-muted-foreground">
          © 2026. Built with <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
