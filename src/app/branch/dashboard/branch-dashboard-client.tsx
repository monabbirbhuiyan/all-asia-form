'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Award, LogOut, Plus, Trash2, Upload, User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

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
  branch_name: string;
  created_at: string;
}

interface Official {
  id: number;
  full_name: string;
  position: string;
  email: string;
  phone: string;
  branch_name: string;
  created_at: string;
}

interface DanTest {
  id: number;
  full_name: string;
  position: string;
  email: string;
  phone: string;
  black_belt: string;
  dan: string;
  international_registration_number: string;
  branch_name: string;
  created_at: string;
}

const BELT_COLORS = [
  'White',
  'Orange',
  'Blue',
  'Yellow',
  'Green',
  'Brown',
  'Black',
];

const BELT_RANKS = [
  '10th Kyu',
  '9th Kyu',
  '8th Kyu',
  '7th Kyu',
  '6th Kyu',
  '5th Kyu',
  '4th Kyu',
  '3rd Kyu',
  '2nd Kyu',
  '1st Kyu',
  '1st Dan',
  '2nd Dan',
  '3rd Dan',
  '4th Dan',
  '5th Dan',
  '6th Dan',
  '7th Dan',
  '8th Dan',
  '9th Dan',
  '10th Dan',
];

export default function BranchDashboardClient({ branchName }: { branchName: string }) {
  const router = useRouter();
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [danTests, setDanTests] = useState<DanTest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fighter form
  const [fighterDialogOpen, setFighterDialogOpen] = useState(false);
  const [fighterSubmitting, setFighterSubmitting] = useState(false);
  const [fighterPhoto, setFighterPhoto] = useState<File | null>(null);
  const [fighterPhotoPreview, setFighterPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fighterForm, setFighterForm] = useState({
    fullName: '',
    branchChiefName: '',
    address: '',
    height: '',
    weight: '',
    beltColor: '',
    beltRank: '',
    internationalRegistrationNumber: '',
  });

  // Official form
  const [officialDialogOpen, setOfficialDialogOpen] = useState(false);
  const [officialSubmitting, setOfficialSubmitting] = useState(false);
  const [officialForm, setOfficialForm] = useState({
    fullName: '',
    position: '',
    email: '',
    phone: '',
  });

  // Dan test form
  const [danTestDialogOpen, setDanTestDialogOpen] = useState(false);
  const [danTestSubmitting, setDanTestSubmitting] = useState(false);
  const [danTestForm, setDanTestForm] = useState({
    fullName: '',
    position: '',
    email: '',
    phone: '',
    blackBelt: '',
    dan: '',
    internationalRegistrationNumber: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fightersRes, officialsRes, danTestsRes] = await Promise.all([
        fetch('/api/fighters'),
        fetch('/api/officials'),
        fetch('/api/dan-tests'),
      ]);

      if (fightersRes.ok) {
        const data = await fightersRes.json();
        setFighters(data.fighters);
      }
      if (officialsRes.ok) {
        const data = await officialsRes.json();
        setOfficials(data.officials);
      }
      if (danTestsRes.ok) {
        const data = await danTestsRes.json();
        setDanTests(data.danTests);
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFighterPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFighterPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetFighterForm = () => {
    setFighterForm({
      fullName: '',
      branchChiefName: '',
      address: '',
      height: '',
      weight: '',
      beltColor: '',
      beltRank: '',
      internationalRegistrationNumber: '',
    });
    setFighterPhoto(null);
    setFighterPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitFighter = async (e: React.FormEvent) => {
    e.preventDefault();
    setFighterSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fighterForm.fullName);
      formData.append('branchChiefName', fighterForm.branchChiefName);
      formData.append('address', fighterForm.address);
      formData.append('height', fighterForm.height);
      formData.append('weight', fighterForm.weight);
      formData.append('beltColor', fighterForm.beltColor);
      formData.append('beltRank', fighterForm.beltRank);
      formData.append('internationalRegistrationNumber', fighterForm.internationalRegistrationNumber);
      
      if (fighterPhoto) {
        formData.append('photo', fighterPhoto);
      }

      const res = await fetch('/api/fighters', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        resetFighterForm();
        setFighterDialogOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to register fighter');
      }
    } catch (error) {
      console.error('Submit fighter error:', error);
      alert('Failed to register fighter');
    } finally {
      setFighterSubmitting(false);
    }
  };

  const handleSubmitOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfficialSubmitting(true);

    try {
      const res = await fetch('/api/officials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(officialForm),
      });

      if (res.ok) {
        setOfficialForm({ fullName: '', position: '', email: '', phone: '' });
        setOfficialDialogOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to register official');
      }
    } catch (error) {
      console.error('Submit official error:', error);
      alert('Failed to register official');
    } finally {
      setOfficialSubmitting(false);
    }
  };

  const handleSubmitDanTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setDanTestSubmitting(true);

    try {
      const res = await fetch('/api/dan-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(danTestForm),
      });

      if (res.ok) {
        setDanTestForm({
          fullName: '',
          position: '',
          email: '',
          phone: '',
          blackBelt: '',
          dan: '',
          internationalRegistrationNumber: '',
        });
        setDanTestDialogOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to register dan test');
      }
    } catch (error) {
      console.error('Submit dan test error:', error);
      alert('Failed to register dan test');
    } finally {
      setDanTestSubmitting(false);
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

  const sanitizeIntegerInput = (value: string) => value.replace(/[^0-9]/g, '');

  const formatWholeNumber = (value: number | string | null | undefined, unit: string) => {
    if (value === null || value === undefined || value === '') return '-';
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return '-';
    return `${Math.trunc(numericValue)} ${unit}`;
  };

  const handleDeleteOfficial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this official?')) return;

    try {
      const res = await fetch(`/api/officials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Delete official error:', error);
    }
  };

  const handleDeleteDanTest = async (id: number) => {
    if (!confirm('Are you sure you want to delete this dan test registration?')) return;

    try {
      const res = await fetch(`/api/dan-tests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Delete dan test error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">{branchName}</h1>
              <p className="text-xs text-muted-foreground">Branch Chief Portal</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Fighters</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{fighters.length}</div>
              <p className="text-xs text-muted-foreground">Registered for championship</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Officials</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{officials.length}</div>
              <p className="text-xs text-muted-foreground">Registered officials</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Dan Tests</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{danTests.length}</div>
              <p className="text-xs text-muted-foreground">Dan test candidates</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="fighters" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fighters">Fighters</TabsTrigger>
            <TabsTrigger value="officials">Officials</TabsTrigger>
            <TabsTrigger value="dan-tests">Dan Test</TabsTrigger>
          </TabsList>

          {/* Fighters Tab */}
          <TabsContent value="fighters">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Fighters</CardTitle>
                  <CardDescription>Register fighters for the championship</CardDescription>
                </div>
                <Dialog open={fighterDialogOpen} onOpenChange={(open) => {
                  setFighterDialogOpen(open);
                  if (!open) resetFighterForm();
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Register Fighter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Register New Fighter</DialogTitle>
                      <DialogDescription>
                        Fill in the fighter&apos;s details for championship registration.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitFighter} className="space-y-4">
                      {/* Photo Upload */}
                      <div className="space-y-2">
                        <Label>Passport Size Photo</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden bg-muted">
                            {fighterPhotoPreview ? (
                              <img
                                src={fighterPhotoPreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-10 w-10 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="hidden"
                              id="photo-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Photo
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1">
                              Upload a passport-size photo (JPEG, PNG)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter full name"
                          value={fighterForm.fullName}
                          onChange={(e) => setFighterForm({ ...fighterForm, fullName: e.target.value })}
                          required
                        />
                      </div>

                      {/* Branch Chief Name */}
                      <div className="space-y-2">
                        <Label htmlFor="branchChiefName">Branch Chief Name</Label>
                        <Input
                          id="branchChiefName"
                          placeholder="Enter branch chief name"
                          value={fighterForm.branchChiefName}
                          onChange={(e) => setFighterForm({ ...fighterForm, branchChiefName: e.target.value })}
                        />
                      </div>

                      {/* Address */}
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter full address"
                          value={fighterForm.address}
                          onChange={(e) => setFighterForm({ ...fighterForm, address: e.target.value })}
                          rows={2}
                        />
                      </div>

                      {/* Height & Weight */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            step="1"
                            min="0"
                            placeholder="e.g., 175"
                            value={fighterForm.height}
                            onChange={(e) => setFighterForm({ ...fighterForm, height: sanitizeIntegerInput(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="1"
                            min="0"
                            placeholder="e.g., 70"
                            value={fighterForm.weight}
                            onChange={(e) => setFighterForm({ ...fighterForm, weight: sanitizeIntegerInput(e.target.value) })}
                          />
                        </div>
                      </div>

                      {/* Belt Color & Rank */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Belt Color</Label>
                          <Select
                            value={fighterForm.beltColor}
                            onValueChange={(value) => setFighterForm({ ...fighterForm, beltColor: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select belt color" />
                            </SelectTrigger>
                            <SelectContent>
                              {BELT_COLORS.map((color) => (
                                <SelectItem key={color} value={color}>
                                  {color}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Belt Rank (Dan/Kyu)</Label>
                          <Select
                            value={fighterForm.beltRank}
                            onValueChange={(value) => setFighterForm({ ...fighterForm, beltRank: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select rank" />
                            </SelectTrigger>
                            <SelectContent>
                              {BELT_RANKS.map((rank) => (
                                <SelectItem key={rank} value={rank}>
                                  {rank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* International Registration Number */}
                      <div className="space-y-2">
                        <Label htmlFor="intlRegNo">International Registration Card Number</Label>
                        <Input
                          id="intlRegNo"
                          placeholder="Enter registration number"
                          value={fighterForm.internationalRegistrationNumber}
                          onChange={(e) => setFighterForm({ ...fighterForm, internationalRegistrationNumber: e.target.value })}
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={fighterSubmitting}>
                        {fighterSubmitting ? 'Registering...' : 'Register Fighter'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Photo</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Branch Chief Name</TableHead>
                        <TableHead>Height</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Belt</TableHead>
                        <TableHead>Intl. Reg. No.</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fighters.map((fighter) => (
                        <TableRow key={fighter.id}>
                          <TableCell>
                            {fighter.photo_url ? (
                              <img
                                src={fighter.photo_url}
                                alt={fighter.full_name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{fighter.full_name}</TableCell>
                          <TableCell>{fighter.branch_chief_name || '-'}</TableCell>
                          <TableCell>{formatWholeNumber(fighter.height, 'cm')}</TableCell>
                          <TableCell>{formatWholeNumber(fighter.weight, 'kg')}</TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {fighter.belt_color} {fighter.belt_rank && `(${fighter.belt_rank})`}
                            </span>
                          </TableCell>
                          <TableCell>{fighter.international_registration_number || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFighter(fighter.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {fighters.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No fighters registered yet. Click &quot;Register Fighter&quot; to add your first fighter.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Officials Tab */}
          <TabsContent value="officials">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Officials</CardTitle>
                  <CardDescription>Register officials for the championship</CardDescription>
                </div>
                <Dialog open={officialDialogOpen} onOpenChange={setOfficialDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Register Official
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register New Official</DialogTitle>
                      <DialogDescription>
                        Fill in the official&apos;s details for championship registration.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitOfficial} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="officialName">Full Name *</Label>
                        <Input
                          id="officialName"
                          placeholder="Enter full name"
                          value={officialForm.fullName}
                          onChange={(e) => setOfficialForm({ ...officialForm, fullName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          placeholder="e.g., Referee, Judge, Coach"
                          value={officialForm.position}
                          onChange={(e) => setOfficialForm({ ...officialForm, position: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="officialEmail">Email</Label>
                        <Input
                          id="officialEmail"
                          type="email"
                          placeholder="Enter email address"
                          value={officialForm.email}
                          onChange={(e) => setOfficialForm({ ...officialForm, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="Enter phone number"
                          value={officialForm.phone}
                          onChange={(e) => setOfficialForm({ ...officialForm, phone: e.target.value })}
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={officialSubmitting}>
                        {officialSubmitting ? 'Registering...' : 'Register Official'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {officials.map((official) => (
                      <TableRow key={official.id}>
                        <TableCell className="font-medium">{official.full_name}</TableCell>
                        <TableCell>{official.position || '-'}</TableCell>
                        <TableCell>{official.email || '-'}</TableCell>
                        <TableCell>{official.phone || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOfficial(official.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {officials.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No officials registered yet. Click &quot;Register Official&quot; to add your first official.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dan Test Tab */}
          <TabsContent value="dan-tests">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Dan Test Candidates</CardTitle>
                  <CardDescription>Register dan test candidates for the championship</CardDescription>
                </div>
                <Dialog open={danTestDialogOpen} onOpenChange={setDanTestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Register Dan Test
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register Dan Test Candidate</DialogTitle>
                      <DialogDescription>
                        Fill in candidate details for dan test registration.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitDanTest} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="danTestName">Full Name *</Label>
                        <Input
                          id="danTestName"
                          placeholder="Enter full name"
                          value={danTestForm.fullName}
                          onChange={(e) => setDanTestForm({ ...danTestForm, fullName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="danTestPosition">Position</Label>
                        <Input
                          id="danTestPosition"
                          placeholder="e.g., Instructor"
                          value={danTestForm.position}
                          onChange={(e) => setDanTestForm({ ...danTestForm, position: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="danTestEmail">Email</Label>
                        <Input
                          id="danTestEmail"
                          type="email"
                          placeholder="Enter email address"
                          value={danTestForm.email}
                          onChange={(e) => setDanTestForm({ ...danTestForm, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="danTestPhone">Phone</Label>
                        <Input
                          id="danTestPhone"
                          placeholder="Enter phone number"
                          value={danTestForm.phone}
                          onChange={(e) => setDanTestForm({ ...danTestForm, phone: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="blackBelt">Black Belt</Label>
                          <Input
                            id="blackBelt"
                            placeholder="e.g., Yes"
                            value={danTestForm.blackBelt}
                            onChange={(e) => setDanTestForm({ ...danTestForm, blackBelt: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dan">Dan</Label>
                          <Input
                            id="dan"
                            placeholder="e.g., 1st Dan"
                            value={danTestForm.dan}
                            onChange={(e) => setDanTestForm({ ...danTestForm, dan: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="danIntlRegNo">International Registration Number</Label>
                        <Input
                          id="danIntlRegNo"
                          placeholder="Enter registration number"
                          value={danTestForm.internationalRegistrationNumber}
                          onChange={(e) => setDanTestForm({ ...danTestForm, internationalRegistrationNumber: e.target.value })}
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={danTestSubmitting}>
                        {danTestSubmitting ? 'Registering...' : 'Register Dan Test'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Black Belt</TableHead>
                      <TableHead>Dan</TableHead>
                      <TableHead>Intl. Reg. No.</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {danTests.map((danTest) => (
                      <TableRow key={danTest.id}>
                        <TableCell className="font-medium">{danTest.full_name}</TableCell>
                        <TableCell>{danTest.position || '-'}</TableCell>
                        <TableCell>{danTest.black_belt || '-'}</TableCell>
                        <TableCell>{danTest.dan || '-'}</TableCell>
                        <TableCell>{danTest.international_registration_number || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDanTest(danTest.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {danTests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No dan test registrations yet. Click &quot;Register Dan Test&quot; to add the first one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
