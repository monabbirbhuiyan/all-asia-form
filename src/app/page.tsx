import Link from 'next/link';
import { Shield, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">18th All Asia Open Championship 2026</h1>
              <p className="text-xs text-muted-foreground">Kyokushin Karate Bangladesh</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin/login">
              <Button variant="outline" size="sm">Admin Login</Button>
            </Link>
            <Link href="/branch/login">
              <Button size="sm">Branch Chief Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Official Registration Portal
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              18th All Asia Open
              <br />
              <span className="text-primary">Full Contact Karate Championship</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Welcome to the official online registration system for Kyokushin Karate&apos;s prestigious continental championship. Branch Chiefs can register their fighters and officials through this secure portal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/branch/login">
              <Button size="lg" className="w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Branch Chief Portal
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Shield className="mr-2 h-5 w-5" />
                Administrator Access
              </Button>
            </Link>
          </div>
        </div>
      </section>     

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">
            Kyokushin Karate - 18th All Asia Open Full Contact Karate Championship
          </p>
          <p className="text-xs opacity-60 mt-2">
            Official Registration Portal - All Rights Reserved
          </p>
          <p className="text-xs opacity-60 mt-2"> 
            Developed by Monabbir Bhuiyan
          </p>
        </div>
      </footer>
    </div>
  );
}
