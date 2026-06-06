import Link from 'next/link';
import { Shield, Users, Award, Clock3, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HomePage() {
  const tracks = [
    {
      title: 'Fighter Registration',
      description: 'Submit complete fighter profiles with belt, photo, and international registration number.',
      icon: Award,
    },
    {
      title: 'Official Registration',
      description: 'Register referees, judges, coaches, and support staff under each branch profile.',
      icon: Shield,
    },
    {
      title: 'Dan Test Candidates',
      description: 'Maintain dedicated dan test candidate records with rank details and registration info.',
      icon: Users,
    },
  ];

  const schedule = [
    { time: '08:00', event: 'Check-in & verification desk opens' },
    { time: '09:30', event: 'Officials briefing and Judging Seminar' },
    { time: '10:00', event: 'Opening ceremony and fighter lineup' },
    { time: '11:00', event: 'Kumite preliminary rounds' },
    { time: '16:00', event: 'Final rounds and award session' },
  ];

  const faqs = [
    {
      question: 'Who can register participants?',
      answer: 'Only approved Branch Chief/Official Dojo Operator accounts can submit fighter, official, and dan test registrations.',
    },
    {
      question: 'Can I edit records after submission?',
      answer: 'Branch Chief/Official Dojo Operators can manage their own records from their dashboard. Admins can manage all records globally.',
    },
    {
      question: 'How do we export records?',
      answer: 'Admins can export CSV from each dashboard section for fighters, officials, Branch Chief/Official Dojo Operator records, and dan tests.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.14),hsl(var(--background))_38%)]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
           
              <Image
                  src="/Kanku.png"
                  alt="Kanku Logo"
                  width={50}
                  height={50}
                  className="h-14 w-14 text-white"
              />
    
            <div>
              <h1 className="font-bold text-lg text-foreground">18th All Asia Open Karate Championship 2026</h1>
              <p className="text-xs text-muted-foreground">Kyokushin Karate Bangladesh</p>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/admin/login">
              <Button variant="outline" size="sm" className="rounded-xl">Admin Login</Button>
            </Link>
            <Link href="/branch/login">
              <Button size="sm" className="rounded-xl">Branch Chief/Official Dojo Operator Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-12 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-chart-1/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-14 md:py-16">
          <div className="relative mx-auto max-w-4xl text-center">
            <Image
              src="/Kanku.png"
              alt=""
              width={400}
              height={400}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-85 w-max -translate-x-1/2 -translate-y-1/2 opacity-10 md:h-auto md:w-auto"
            />

            <div className="relative z-10">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Official Registration Portal
            </span>
            <h1 className="mb-4 text-balance text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
              18th All Asia Open
              <br />
              <span className="text-primary">Karate Championship 2026</span>
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              Welcome to the official online registration system for Kyokushin Karate&apos;s prestigious continental championship. Branch Chief/Official Dojo Operators can register their fighters and officials through this secure portal.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/branch/login">
                <Button size="lg" className="w-full rounded-xl sm:w-auto">
                  <Users className="mr-2 h-5 w-5" />
                  Branch Chief/Official Dojo Operator Portal
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button size="lg" variant="outline" className="w-full rounded-xl sm:w-auto">
                  <Shield className="mr-2 h-5 w-5" />
                  Administrator Access
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 text-left backdrop-blur-sm md:grid-cols-3">
              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Event Date</p>
                <p className="mt-1 font-semibold">20-21 November 2026</p>
              </div>
              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Location</p>
                <p className="mt-1 font-semibold">Dhaka, Bangladesh</p>
              </div>
              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Format</p>
                <p className="mt-1 font-semibold">Kumite</p>
              </div>
            </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {tracks.map((track) => (
              <article key={track.title} className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <track.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{track.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{track.description}</p>
              </article>
            ))}
          </div>

          
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 bg-sidebar py-8 text-sidebar-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">
            Kyokushin Karate - 18th All Asia Open Karate Championship
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
