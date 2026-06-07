'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JSZip from 'jszip';
import { 
  Users, Shield, Award, Download, Plus, LogOut, 
  Trash2, ToggleLeft, ToggleRight, Sparkles,
  Pencil
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface BranchChief {
  id: number;
  branch_name: string;
  email: string;
  contact_email?: string | null;
  is_active: boolean;
  created_at: string;
  detail_id?: number | null;
  full_name?: string | null;
  operator_role?: string | null;
  address?: string | null;
  branch_chief_card_number?: string | null;
  country?: string | null;
  phone?: string | null;
  detail_email?: string | null;
  international_registration_number?: string | null;
  training_seminar?: string | null;
  dan_test_participation?: string | null;
  dan_test_qualification_number?: string | null;
  photo_url?: string | null;
  passport_image_url?: string | null;
  detail_created_at?: string | null;
  detail_updated_at?: string | null;
}

interface Fighter {
  id: number;
  full_name: string;
  branch_chief_name?: string | null;
  address: string;
  height: number | string | null;
  weight: number | string | null;
  belt_color: string;
  belt_rank: string;
  international_registration_number: string;
  photo_url: string;
  passport_image_url?: string | null;
  branch_name: string;
  created_at: string;
}

const SHARED_BRANCH_CHIEF_PASSWORD = 'AllAsia2026#Kyoku!Access';

const notify = (title: string, description?: string, variant: 'default' | 'destructive' = 'default') => {
  toast({ title, description, variant });
};

export default function AdminDashboardClient() {
  const router = useRouter();
  const [branchChiefs, setBranchChiefs] = useState<BranchChief[]>([]);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [downloadingZipFor, setDownloadingZipFor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // New branch chief form
  const [newBranchName, setNewBranchName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [editBranchChiefId, setEditBranchChiefId] = useState<number | null>(null);
  const [editBranchName, setEditBranchName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editContactEmail, setEditContactEmail] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchData();

    const pollInterval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  const fetchData = async () => {
    try {
      const [chiefsRes, fightersRes] = await Promise.all([
        fetch('/api/branch-chiefs'),
        fetch('/api/fighters'),
      ]);

      if (chiefsRes.ok) {
        const data = await chiefsRes.json();
        setBranchChiefs(data.branchChiefs);
      }
      if (fightersRes.ok) {
        const data = await fightersRes.json();
        setFighters(data.fighters);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleCreateBranchChief = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/branch-chiefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchName: newBranchName,
          email: newEmail,
          contactEmail: newContactEmail,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewBranchName('');
        setNewEmail('');
        setNewContactEmail('');
        setCreateDialogOpen(false);
        notify(
          'Branch Chief/Official Dojo Operator created',
          `Shared password: ${data.sharedPassword || SHARED_BRANCH_CHIEF_PASSWORD}`
        );
        fetchData();
      } else {
        const data = await res.json();
        notify('Failed to create Branch Chief/Official Dojo Operator', data.error || undefined, 'destructive');
      }
    } catch (error) {
      console.error('Create error:', error);
      notify('Failed to create Branch Chief/Official Dojo Operator', 'Please try again.', 'destructive');
    } finally {
      setCreating(false);
    }
  };

  const openEditBranchChief = (chief: BranchChief) => {
    setEditBranchChiefId(chief.id);
    setEditBranchName(chief.branch_name);
    setEditEmail(chief.email.includes('@') ? chief.email.split('@')[0] : chief.email);
    setEditContactEmail(chief.contact_email || '');
  };

  const handleEditBranchChief = async (id: number) => {
    if (!editBranchName.trim() || !editEmail.trim()) return;

    setEditing(true);
    try {
      const res = await fetch(`/api/branch-chiefs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchName: editBranchName,
          email: editEmail,
          contactEmail: editContactEmail,
        }),
      });

      if (res.ok) {
        setEditBranchChiefId(null);
        setEditBranchName('');
        setEditEmail('');
        setEditContactEmail('');
        fetchData();
      } else {
        const data = await res.json();
        notify('Failed to update Branch Chief/Official Dojo Operator', data.error || undefined, 'destructive');
      }
    } catch (error) {
      console.error('Edit Branch Chief/Official Dojo Operator error:', error);
      notify('Failed to update Branch Chief/Official Dojo Operator', 'Please try again.', 'destructive');
    } finally {
      setEditing(false);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/branch-chiefs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleDeleteBranchChief = async (id: number) => {
    if (!confirm('Are you sure? This will also delete all registrations for this branch.')) {
      return;
    }

    try {
      const res = await fetch(`/api/branch-chiefs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDeleteFighter = async (id: number) => {
    if (!confirm('Are you sure you want to delete this fighter?')) return;

    try {
      const res = await fetch(`/api/fighters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Delete fighter error:', error);
    }
  };

  const exportCSV = (type: string) => {
    window.open(`/api/export?type=${type}`, '_blank');
  };

  const sanitizeFileName = (value: string) =>
    value
      .trim()
      .replace(/[^a-zA-Z0-9\s_-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase();

  const resolveImageExtension = (url: string, mimeType: string) => {
    if (mimeType.includes('png')) return 'png';
    if (mimeType.includes('webp')) return 'webp';
    if (mimeType.includes('gif')) return 'gif';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';

    const cleanUrl = url.split('?')[0];
    const fileName = cleanUrl.split('/').pop() || '';
    const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch?.[1]?.toLowerCase();

    if (ext && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext;
    }

    return 'jpg';
  };

  const handleDownloadBranchChiefImagesZip = async (chief: BranchChief) => {
    if (!chief.photo_url && !chief.passport_image_url) {
      notify('No images to download', 'This Branch Chief has no uploaded images.', 'destructive');
      return;
    }

    setDownloadingZipFor(chief.id);

    try {
      const zip = new JSZip();
      const safeName = sanitizeFileName(chief.full_name || chief.branch_name) || `chief_${chief.id}`;

      if (chief.photo_url) {
        const photoRes = await fetch(chief.photo_url);
        if (!photoRes.ok) {
          throw new Error('Failed to fetch Branch Chief photo');
        }
        const photoBlob = await photoRes.blob();
        const photoExt = resolveImageExtension(chief.photo_url, photoBlob.type || '');
        const photoBuffer = await photoBlob.arrayBuffer();
        zip.file(`${safeName}_photo.${photoExt}`, photoBuffer);
      }

      if (chief.passport_image_url) {
        const passportRes = await fetch(chief.passport_image_url);
        if (!passportRes.ok) {
          throw new Error('Failed to fetch passport image');
        }
        const passportBlob = await passportRes.blob();
        const passportExt = resolveImageExtension(chief.passport_image_url, passportBlob.type || '');
        const passportBuffer = await passportBlob.arrayBuffer();
        zip.file(`${safeName}_passport.${passportExt}`, passportBuffer);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${safeName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download ZIP error:', error);
      notify('Failed to download images ZIP', 'Please try again.', 'destructive');
    } finally {
      setDownloadingZipFor(null);
    }
  };

  const handleDownloadFighterImagesZip = async (fighter: Fighter) => {
    if (!fighter.photo_url && !fighter.passport_image_url) {
      notify('No images to download', 'This fighter has no uploaded images.', 'destructive');
      return;
    }

    setDownloadingZipFor(fighter.id);

    try {
      const zip = new JSZip();
      const safeName = sanitizeFileName(fighter.full_name) || `fighter_${fighter.id}`;

      if (fighter.photo_url) {
        const photoRes = await fetch(fighter.photo_url);
        if (!photoRes.ok) {
          throw new Error('Failed to fetch fighter photo');
        }
        const photoBlob = await photoRes.blob();
        const photoExt = resolveImageExtension(fighter.photo_url, photoBlob.type || '');
        const photoBuffer = await photoBlob.arrayBuffer();
        zip.file(`${safeName}_fighter_photo.${photoExt}`, photoBuffer);
      }

      if (fighter.passport_image_url) {
        const passportRes = await fetch(fighter.passport_image_url);
        if (!passportRes.ok) {
          throw new Error('Failed to fetch passport image');
        }
        const passportBlob = await passportRes.blob();
        const passportExt = resolveImageExtension(fighter.passport_image_url, passportBlob.type || '');
        const passportBuffer = await passportBlob.arrayBuffer();
        zip.file(`${safeName}_passport_image.${passportExt}`, passportBuffer);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${safeName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download ZIP error:', error);
      notify('Failed to download images ZIP', 'Please try again.', 'destructive');
    } finally {
      setDownloadingZipFor(null);
    }
  };

  const formatWholeNumber = (value: number | string | null | undefined, unit: string) => {
    if (value === null || value === undefined || value === '') return '-';
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return '-';
    return `${Math.trunc(numericValue)} ${unit}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-linear(circle_at_top,hsl(var(--primary)/0.15),hsl(var(--background))_35%)]">
        <div className="rounded-2xl border bg-card/80 backdrop-blur px-6 py-4 text-muted-foreground shadow-lg">
          Loading admin portal...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[radial-linear(circle_at_top,hsl(var(--primary)/0.18),hsl(var(--background))_42%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-40 -right-16 h-80 w-80 rounded-full bg-chart-1/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-chart-3 shadow-lg shadow-primary/30">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">18th All Asia Open Karate Championship 2026</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl bg-card/70" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-8 flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Control Center</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Competition Operations Dashboard</h2>
            <p className="text-sm text-muted-foreground">Monitor registrations, manage credentials, and export records.</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Shared Password</span>
              <span className="text-sm font-mono text-foreground">{SHARED_BRANCH_CHIEF_PASSWORD}</span>
            </div>
          </div>
          <div className="hidden rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-primary md:flex md:items-center md:gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-medium">Live Admin Mode</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-border/60 bg-card/75 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Branch Chief/Official Dojo Operators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{branchChiefs.length}</div>
              <p className="text-xs text-muted-foreground">
                {branchChiefs.filter(b => b.is_active).length} active
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/75 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fighters</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{fighters.length}</div>
              <p className="text-xs text-muted-foreground">Registered fighters</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="branch-chiefs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 rounded-xl border border-border/60 bg-card/80 p-1 backdrop-blur-sm md:w-fit md:min-w-80">
            <TabsTrigger value="branch-chiefs">Branch Chief/Official Dojo Operators</TabsTrigger>
            <TabsTrigger value="fighters">Fighters</TabsTrigger>
          </TabsList>

          {/* Branch Chiefs Tab */}
          <TabsContent value="branch-chiefs">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Branch Chief/Official Dojo Operators</CardTitle>
                  <CardDescription>Manage Branch Chief/Official Dojo Operator accounts</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl" onClick={() => exportCSV('branch_chiefs')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="rounded-xl">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Branch Chief/Official Dojo Operator
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Branch Chief/Official Dojo Operator Account</DialogTitle>
                        <DialogDescription>
                          Create a new login for a Branch Chief/Official Dojo Operator to register their fighters.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateBranchChief} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="branchName">Branch Chief/Official Dojo Operator Branch Name</Label>
                          <Input
                            id="branchName"
                            placeholder="e.g., Tokyo Branch"
                            value={newBranchName}
                            onChange={(e) => setNewBranchName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="flex items-center gap-0 border border-input rounded-md overflow-hidden">
                            <Input
                              id="email"
                              type="text"
                              placeholder="username"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value.split('@')[0])}
                              className="border-0 focus:ring-0"
                              required
                            />
                            <span className="px-3 py-2 bg-muted text-muted-foreground font-medium whitespace-nowrap">@kyokushinbd.com</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Enter username only</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail">Branch Chief/Dojo operator Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            placeholder="Enter Branch Chief/Dojo operator email"
                            value={newContactEmail}
                            onChange={(e) => setNewContactEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Shared Password</Label>
                          <div className="rounded-md border border-input bg-muted/40 px-3 py-2 text-sm font-medium text-foreground">
                            {SHARED_BRANCH_CHIEF_PASSWORD}
                          </div>
                          <p className="text-xs text-muted-foreground">This same strong password will be used for every Branch Chief/Official Dojo Operator account.</p>
                        </div>
                        <Button type="submit" className="w-full" disabled={creating}>
                          {creating ? 'Creating...' : 'Create Account'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {branchChiefs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {branchChiefs.map((chief) => (
                      <div
                        key={chief.id}
                        className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm transition-colors hover:bg-muted/30"
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {chief.photo_url ? (
                              <img
                                src={chief.photo_url}
                                alt={chief.full_name || chief.branch_name}
                                className="h-12 w-12 rounded-full border border-border object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold leading-tight">{chief.full_name || chief.branch_name}</p>
                              <p className="text-xs text-muted-foreground">{chief.branch_name}</p>
                              <p className="text-[11px] text-muted-foreground">{chief.email}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            chief.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {chief.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

<div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                           <div className="rounded-lg bg-muted/40 px-3 py-2">
                             <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Role</p>
                             <p className="font-medium">{chief.operator_role || '-'}</p>
                           </div>
                           <div className="rounded-lg bg-muted/40 px-3 py-2">
                             <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Card Number</p>
                             <p className="font-medium break-all">{chief.branch_chief_card_number || '-'}</p>
                           </div>
                           <div className="rounded-lg bg-muted/40 px-3 py-2">
                             <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Phone</p>
                             <p className="font-medium">{chief.phone || '-'}</p>
                           </div>
                           <div className="rounded-lg bg-muted/40 px-3 py-2">
                             <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Contact Email</p>
                             <p className="font-medium">{chief.contact_email || '-'}</p>
                           </div>
                           <div className="rounded-lg bg-muted/40 px-3 py-2">
                             <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Country</p>
                             <p className="font-medium">{chief.country || '-'}</p>
                           </div>
                           <div className="col-span-2 rounded-lg bg-muted/40 px-3 py-2">
                             <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Intl. Reg. No.</p>
                             <p className="font-medium break-all">{chief.international_registration_number || '-'}</p>
                           </div>
                           <div className="col-span-2 rounded-lg bg-muted/40 px-3 py-2">
                             <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Address</p>
                             <p className="font-medium">{chief.address || '-'}</p>
                           </div>
                         </div>

                         <div className="mb-3 text-[11px] text-muted-foreground">
                           <p>Account Created: {new Date(chief.created_at).toLocaleDateString()}</p>
                           <p>
                             Form Updated: {chief.detail_updated_at ? new Date(chief.detail_updated_at).toLocaleDateString() : 'Not submitted yet'}
                           </p>
                         </div>

                         <div className="flex justify-end gap-1">
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => handleDownloadBranchChiefImagesZip(chief)}
                             disabled={downloadingZipFor === chief.id || (!chief.photo_url && !chief.passport_image_url)}
                             title="Download Branch Chief photo and passport images as ZIP"
                           >
                             <Download className="h-4 w-4" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => handleToggleActive(chief.id, chief.is_active)}
                            title={chief.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {chief.is_active ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Dialog open={editBranchChiefId === chief.id} onOpenChange={(open) => !open && setEditBranchChiefId(null)}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditBranchChief(chief)}
                                title="Edit Branch Chief/Official Dojo Operator"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Branch Chief/Official Dojo Operator</DialogTitle>
                                <DialogDescription>
                                  Update Branch Chief/Official Dojo Operator details for {chief.branch_name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editBranchName">Branch Chief/Official Dojo Operator Branch Name</Label>
                                  <Input
                                    id="editBranchName"
                                    value={editBranchName}
                                    onChange={(e) => setEditBranchName(e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editEmail">Email Username</Label>
                                  <div className="flex items-center gap-0 overflow-hidden rounded-md border border-input">
                                    <Input
                                      id="editEmail"
                                      type="text"
                                      value={editEmail}
                                      onChange={(e) => setEditEmail(e.target.value.split('@')[0])}
                                      className="border-0 focus:ring-0"
                                      required
                                    />
                                    <span className="whitespace-nowrap bg-muted px-3 py-2 font-medium text-muted-foreground">@kyokushinbd.com</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editContactEmail">Branch Chief/Dojo operator Email</Label>
                                  <Input
                                    id="editContactEmail"
                                    type="email"
                                    placeholder="Enter Branch Chief/Dojo operator email"
                                    value={editContactEmail}
                                    onChange={(e) => setEditContactEmail(e.target.value)}
                                  />
                                </div>
                                <Button onClick={() => handleEditBranchChief(chief.id)} className="w-full" disabled={editing}>
                                  {editing ? 'Saving...' : 'Save Changes'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBranchChief(chief.id)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No Branch Chief/Official Dojo Operator accounts registered yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fighters Tab */}
          <TabsContent value="fighters">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registered Fighters</CardTitle>
                  <CardDescription>All fighters registered for the championship</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => exportCSV('fighters')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {fighters.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {fighters.map((fighter) => (
                      <div
                        key={fighter.id}
                        className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm transition-colors hover:bg-muted/30"
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {fighter.photo_url ? (
                              <img
                                src={fighter.photo_url}
                                alt={fighter.full_name}
                                className="h-12 w-12 rounded-full border border-border object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold leading-tight">{fighter.full_name}</p>
                              <p className="text-xs text-muted-foreground">{fighter.branch_name}</p>
                              {fighter.branch_chief_name && (
                                <p className="text-[11px] text-muted-foreground">Chief: {fighter.branch_chief_name}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadFighterImagesZip(fighter)}
                              disabled={downloadingZipFor === fighter.id || (!fighter.photo_url && !fighter.passport_image_url)}
                              title="Download fighter and passport images as ZIP"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFighter(fighter.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-lg bg-muted/40 px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Height</p>
                            <p className="font-medium">{formatWholeNumber(fighter.height, 'cm')}</p>
                          </div>
                          <div className="rounded-lg bg-muted/40 px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Weight</p>
                            <p className="font-medium">{formatWholeNumber(fighter.weight, 'kg')}</p>
                          </div>
                          <div className="col-span-2 rounded-lg bg-muted/40 px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Belt</p>
                            <p className="font-medium">
                              {fighter.belt_color || '-'} {fighter.belt_rank ? `(${fighter.belt_rank})` : ''}
                            </p>
                          </div>
                          <div className="col-span-2 rounded-lg bg-muted/40 px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Intl. Reg. No.</p>
                            <p className="font-medium break-all">{fighter.international_registration_number || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No fighters registered yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
