import { Phone, MessageCircle } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BUSINESS_CONTACT } from '../config/businessContact';

export default function ContactUsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with us for wholesale inquiries and orders
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Phone Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Phone
              </CardTitle>
              <CardDescription>Call us directly</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={`tel:${BUSINESS_CONTACT.phone}`}
                className="text-lg font-semibold hover:text-primary transition-colors"
              >
                {BUSINESS_CONTACT.phone}
              </a>
            </CardContent>
          </Card>

          {/* WhatsApp Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                WhatsApp
              </CardTitle>
              <CardDescription>Message us on WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={`https://wa.me/${BUSINESS_CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:text-primary transition-colors"
              >
                {BUSINESS_CONTACT.whatsapp}
              </a>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-3 w-full"
              >
                <a
                  href={`https://wa.me/${BUSINESS_CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Open WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Instagram Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SiInstagram className="h-5 w-5 text-primary" />
                Instagram
              </CardTitle>
              <CardDescription>Follow us on Instagram</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={BUSINESS_CONTACT.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:text-primary transition-colors"
              >
                {BUSINESS_CONTACT.instagram.handle}
              </a>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-3"
              >
                <a
                  href={BUSINESS_CONTACT.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiInstagram className="h-4 w-4 mr-2" />
                  Visit Instagram
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Address Card - Only shown when configured */}
          {BUSINESS_CONTACT.address && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Visit us at</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{BUSINESS_CONTACT.address}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
          <p className="text-muted-foreground">
            We're available to assist you with your wholesale needs. Contact us through any of the channels above.
          </p>
        </div>
      </div>
    </div>
  );
}
