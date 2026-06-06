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
  training_seminar?: string | null;
  dan_test_participation?: string | null;
  dan_test_qualification_number?: string | null;
  international_registration_number: string;
  photo_url: string;
  passport_image_url?: string | null;
  branch_name: string;
  created_at: string;
}

interface Official {
  id: number;
  full_name: string;
  position: string;
  country?: string | null;
  passport_number?: string | null;
  training_seminar?: string | null;
  email: string;
  phone: string;
  photo_url?: string | null;
  passport_image_url?: string | null;
  branch_name: string;
  created_at: string;
}

interface DanTest {
  id: number;
  full_name: string;
  position: string;
  country?: string | null;
  passport_number?: string | null;
  training_seminar?: string | null;
  email: string;
  phone: string;
  black_belt: string;
  dan: string;
  international_registration_number: string;
  passport_image_url?: string | null;
  branch_name: string;
  created_at: string;
}

interface BranchChiefDetail {
  id: number;
  full_name: string;
  operator_role?: string | null;
  address?: string | null;
  branch_chief_card_number?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  photo_url?: string | null;
  passport_image_url?: string | null;
  international_registration_number?: string | null;
  training_seminar?: string | null;
  dan_test_participation?: string | null;
  dan_test_qualification_number?: string | null;
  branch_name: string;
  created_at: string;
}

interface TournamentEntry {
  tournamentName: string;
  achievement: string;
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

const TRAINING_SEMINAR_OPTIONS = ['Yes', 'No'];

export default function BranchDashboardClient({ branchName }: { branchName: string }) {
  const router = useRouter();
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [branchChiefDetails, setBranchChiefDetails] = useState<BranchChiefDetail[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fighter form
  const [fighterDialogOpen, setFighterDialogOpen] = useState(false);
  const [fighterSubmitting, setFighterSubmitting] = useState(false);
  const [fighterPhoto, setFighterPhoto] = useState<File | null>(null);
  const [fighterPhotoPreview, setFighterPhotoPreview] = useState<string | null>(null);
  const [fighterPassportImage, setFighterPassportImage] = useState<File | null>(null);
  const [fighterPassportPreview, setFighterPassportPreview] = useState<string | null>(null);
  const [tournamentEntries, setTournamentEntries] = useState<TournamentEntry[]>([
    { tournamentName: '', achievement: '' },
  ]);
  const fighterPhotoInputRef = useRef<HTMLInputElement>(null);
  const fighterPassportInputRef = useRef<HTMLInputElement>(null);
  const [fighterForm, setFighterForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    country: '',
    passportNumber: '',
    branchChiefName: '',
    address: '',
    height: '',
    weight: '',
    beltColor: '',
    beltRank: '',
    trainingSeminar: '',
    danTestParticipation: '',
    danTestQualificationNumber: '',
    internationalRegistrationNumber: '',
  });

  // Official form
  const [officialDialogOpen, setOfficialDialogOpen] = useState(false);
  const [officialSubmitting, setOfficialSubmitting] = useState(false);
  const [officialPhoto, setOfficialPhoto] = useState<File | null>(null);
  const [officialPhotoPreview, setOfficialPhotoPreview] = useState<string | null>(null);
  const [officialPassportImage, setOfficialPassportImage] = useState<File | null>(null);
  const [officialPassportPreview, setOfficialPassportPreview] = useState<string | null>(null);
  const officialPhotoInputRef = useRef<HTMLInputElement>(null);
  const officialPassportInputRef = useRef<HTMLInputElement>(null);
  const [officialForm, setOfficialForm] = useState({
    fullName: '',
    position: '',
    country: '',
    passportNumber: '',
    trainingSeminar: '',
    email: '',
    phone: '',
  });

  // Dan test form
  const [danTestDialogOpen, setDanTestDialogOpen] = useState(false);
  const [danTestSubmitting, setDanTestSubmitting] = useState(false);
  const [danTestPassportImage, setDanTestPassportImage] = useState<File | null>(null);
  const [danTestPassportPreview, setDanTestPassportPreview] = useState<string | null>(null);
  const danTestPassportInputRef = useRef<HTMLInputElement>(null);
  const [danTestForm, setDanTestForm] = useState({
    fullName: '',
    position: '',
    country: '',
    passportNumber: '',
    trainingSeminar: '',
    email: '',
    phone: '',
    blackBelt: '',
    dan: '',
    internationalRegistrationNumber: '',
  });

  // Branch chief details form
  const [branchChiefDetailDialogOpen, setBranchChiefDetailDialogOpen] = useState(false);
  const [branchChiefDetailSubmitting, setBranchChiefDetailSubmitting] = useState(false);
  const [branchChiefDetailPhoto, setBranchChiefDetailPhoto] = useState<File | null>(null);
  const [branchChiefDetailPhotoPreview, setBranchChiefDetailPhotoPreview] = useState<string | null>(null);
  const [branchChiefDetailPassportImage, setBranchChiefDetailPassportImage] = useState<File | null>(null);
  const [branchChiefDetailPassportPreview, setBranchChiefDetailPassportPreview] = useState<string | null>(null);
  const branchChiefDetailPhotoInputRef = useRef<HTMLInputElement>(null);
  const branchChiefDetailPassportInputRef = useRef<HTMLInputElement>(null);
  const [branchChiefDetailForm, setBranchChiefDetailForm] = useState({
    operatorRole: '',
    fullName: '',
    address: '',
    branchChiefCardNumber: '',
    country: '',
    phone: '',
    email: '',
    internationalRegistrationNumber: '',
    trainingSeminar: '',
    danTestParticipation: '',
    danTestQualificationNumber: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fightersRes, branchChiefDetailsRes] = await Promise.all([
        fetch('/api/fighters'),
        fetch('/api/branch-chief-details'),
      ]);

      if (fightersRes.ok) {
        const data = await fightersRes.json();
        setFighters(data.fighters);
      }
      if (branchChiefDetailsRes.ok) {
        const data = await branchChiefDetailsRes.json();
        setBranchChiefDetails(data.details);
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

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const readImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for dimension validation'));
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    });
  };

  const isTwoByTwoPointFiveRatio = (width: number, height: number) => {
    const expectedRatio = 2 / 2.5;
    const actualRatio = width / height;
    return Math.abs(actualRatio - expectedRatio) <= 0.03;
  };

  const handleFighterPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { width, height } = await readImageDimensions(file);
      if (!isTwoByTwoPointFiveRatio(width, height)) {
        alert('Fighter photo must be in 2:2.5 ratio (2-inch width x 2.5-inch height).');
        if (fighterPhotoInputRef.current) {
          fighterPhotoInputRef.current.value = '';
        }
        return;
      }

      setFighterPhoto(file);
      const dataUrl = await fileToDataUrl(file);
      setFighterPhotoPreview(dataUrl);
    } catch (error) {
      console.error('Fighter photo validation failed:', error);
      alert('Failed to process photo. Please try another image.');
    }
  };

  const handleFighterPassportChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFighterPassportImage(file);
    const dataUrl = await fileToDataUrl(file);
    setFighterPassportPreview(dataUrl);
  };

  const handleOfficialPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOfficialPhoto(file);
    const dataUrl = await fileToDataUrl(file);
    setOfficialPhotoPreview(dataUrl);
  };

  const handleOfficialPassportChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOfficialPassportImage(file);
    const dataUrl = await fileToDataUrl(file);
    setOfficialPassportPreview(dataUrl);
  };

  const handleDanTestPassportChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDanTestPassportImage(file);
    const dataUrl = await fileToDataUrl(file);
    setDanTestPassportPreview(dataUrl);
  };

  const handleBranchChiefDetailPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBranchChiefDetailPhoto(file);
    const dataUrl = await fileToDataUrl(file);
    setBranchChiefDetailPhotoPreview(dataUrl);
  };

  const handleBranchChiefDetailPassportChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBranchChiefDetailPassportImage(file);
    const dataUrl = await fileToDataUrl(file);
    setBranchChiefDetailPassportPreview(dataUrl);
  };

  const resetFighterForm = () => {
    setFighterForm({
      fullName: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      country: '',
      passportNumber: '',
      branchChiefName: '',
      address: '',
      height: '',
      weight: '',
      beltColor: '',
      beltRank: '',
      trainingSeminar: '',
      danTestParticipation: '',
      danTestQualificationNumber: '',
      internationalRegistrationNumber: '',
    });
    setTournamentEntries([{ tournamentName: '', achievement: '' }]);
    setFighterPhoto(null);
    setFighterPhotoPreview(null);
    setFighterPassportImage(null);
    setFighterPassportPreview(null);
    if (fighterPhotoInputRef.current) {
      fighterPhotoInputRef.current.value = '';
    }
    if (fighterPassportInputRef.current) {
      fighterPassportInputRef.current.value = '';
    }
  };

  const resetOfficialForm = () => {
    setOfficialForm({
      fullName: '',
      position: '',
      country: '',
      passportNumber: '',
      trainingSeminar: '',
      email: '',
      phone: '',
    });
    setOfficialPhoto(null);
    setOfficialPhotoPreview(null);
    setOfficialPassportImage(null);
    setOfficialPassportPreview(null);
    if (officialPhotoInputRef.current) {
      officialPhotoInputRef.current.value = '';
    }
    if (officialPassportInputRef.current) {
      officialPassportInputRef.current.value = '';
    }
  };

  const resetDanTestForm = () => {
    setDanTestForm({
      fullName: '',
      position: '',
      country: '',
      passportNumber: '',
      trainingSeminar: '',
      email: '',
      phone: '',
      blackBelt: '',
      dan: '',
      internationalRegistrationNumber: '',
    });
    setDanTestPassportImage(null);
    setDanTestPassportPreview(null);
    if (danTestPassportInputRef.current) {
      danTestPassportInputRef.current.value = '';
    }
  };

  const resetBranchChiefDetailForm = () => {
    setBranchChiefDetailForm({
      operatorRole: '',
      fullName: '',
      address: '',
      branchChiefCardNumber: '',
      country: '',
      phone: '',
      email: '',
      internationalRegistrationNumber: '',
      trainingSeminar: '',
      danTestParticipation: '',
      danTestQualificationNumber: '',
    });
    setBranchChiefDetailPhoto(null);
    setBranchChiefDetailPhotoPreview(null);
    setBranchChiefDetailPassportImage(null);
    setBranchChiefDetailPassportPreview(null);
    if (branchChiefDetailPhotoInputRef.current) {
      branchChiefDetailPhotoInputRef.current.value = '';
    }
    if (branchChiefDetailPassportInputRef.current) {
      branchChiefDetailPassportInputRef.current.value = '';
    }
  };

  const addTournamentEntry = () => {
    setTournamentEntries((prev) => [...prev, { tournamentName: '', achievement: '' }]);
  };

  const removeTournamentEntry = (index: number) => {
    setTournamentEntries((prev) => {
      if (prev.length === 1) {
        return [{ tournamentName: '', achievement: '' }];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateTournamentEntry = (
    index: number,
    field: keyof TournamentEntry,
    value: string
  ) => {
    setTournamentEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
    );
  };

  const handleSubmitFighter = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasInvalidTournamentEntry = tournamentEntries.some(
      (entry) => !entry.tournamentName.trim() || !entry.achievement.trim()
    );

    if (hasInvalidTournamentEntry) {
      alert('Please complete all tournament cards. If there is no achievement, write N/A.');
      return;
    }

    setFighterSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fighterForm.fullName);
      formData.append('phone', fighterForm.phone);
      formData.append('email', fighterForm.email);
      formData.append('dateOfBirth', fighterForm.dateOfBirth);
      formData.append('country', fighterForm.country);
      formData.append('passportNumber', fighterForm.passportNumber);
      formData.append('branchChiefName', fighterForm.branchChiefName);
      formData.append('address', fighterForm.address);
      formData.append('height', fighterForm.height);
      formData.append('weight', fighterForm.weight);
      formData.append('beltColor', fighterForm.beltColor);
      formData.append('beltRank', fighterForm.beltRank);
      formData.append('trainingSeminar', fighterForm.trainingSeminar);
      formData.append('danTestParticipation', fighterForm.danTestParticipation);
      formData.append('danTestQualificationNumber', fighterForm.danTestQualificationNumber);
      formData.append('internationalRegistrationNumber', fighterForm.internationalRegistrationNumber);
      formData.append('tournamentHistory', JSON.stringify(tournamentEntries));
      
      if (fighterPhoto) {
        formData.append('photo', fighterPhoto);
      }
      if (fighterPassportImage) {
        formData.append('passportImage', fighterPassportImage);
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
      const photoDataUrl = officialPhoto ? await fileToDataUrl(officialPhoto) : null;
      const passportImageDataUrl = officialPassportImage ? await fileToDataUrl(officialPassportImage) : null;

      const res = await fetch('/api/officials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...officialForm,
          photoDataUrl,
          passportImageDataUrl,
        }),
      });

      if (res.ok) {
        resetOfficialForm();
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
      const passportImageDataUrl = danTestPassportImage ? await fileToDataUrl(danTestPassportImage) : null;

      const res = await fetch('/api/dan-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...danTestForm,
          passportImageDataUrl,
        }),
      });

      if (res.ok) {
        resetDanTestForm();
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

  const handleSubmitBranchChiefDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBranchChiefDetailSubmitting(true);

    try {
      const photoDataUrl = branchChiefDetailPhoto ? await fileToDataUrl(branchChiefDetailPhoto) : null;
      const passportImageDataUrl = branchChiefDetailPassportImage ? await fileToDataUrl(branchChiefDetailPassportImage) : null;

      const res = await fetch('/api/branch-chief-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...branchChiefDetailForm,
          photoDataUrl,
          passportImageDataUrl,
        }),
      });

      if (res.ok) {
        resetBranchChiefDetailForm();
        setBranchChiefDetailDialogOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit branch chief/dojo operator details');
      }
    } catch (error) {
      console.error('Submit branch chief details error:', error);
      alert('Failed to submit branch chief/dojo operator details');
    } finally {
      setBranchChiefDetailSubmitting(false);
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

  const handleDeleteBranchChiefDetail = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const res = await fetch(`/api/branch-chief-details/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Delete branch chief details error:', error);
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
              <p className="text-xs text-muted-foreground">Branch Chief/Dojo Operator Portal</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Branch Chief / Dojo Operator</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{branchChiefDetails.length}</div>
              <p className="text-xs text-muted-foreground">Submitted detail entries</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="fighters" className="space-y-4">
          <TabsList>
            <TabsTrigger value="branch-chief-details">Branch Chief / Dojo Operator</TabsTrigger>
            <TabsTrigger value="fighters">Fighters</TabsTrigger>
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
                  <DialogContent className="w-[98vw] sm:max-w-6xl! max-h-[90vh] overflow-y-auto">
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
                              ref={fighterPhotoInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFighterPhotoChange}
                              className="hidden"
                              id="photo-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fighterPhotoInputRef.current?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Photo
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1">
                              Upload a passport-size photo (JPEG, PNG) with 2:2.5 ratio (2-inch width x 2.5-inch height)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Passport Image Upload */}
                      <div className="space-y-2">
                        <Label>Passport Image</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden bg-muted">
                            {fighterPassportPreview ? (
                              <img
                                src={fighterPassportPreview}
                                alt="Passport preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              ref={fighterPassportInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFighterPassportChange}
                              className="hidden"
                              id="fighter-passport-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fighterPassportInputRef.current?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Passport Image
                            </Button>
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

                      {/* Phone, Email, Date of Birth, Country & Passport */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fighterPhone">Phone</Label>
                          <Input
                            id="fighterPhone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={fighterForm.phone}
                            onChange={(e) => setFighterForm({ ...fighterForm, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fighterEmail">Email</Label>
                          <Input
                            id="fighterEmail"
                            type="email"
                            placeholder="Enter email"
                            value={fighterForm.email}
                            onChange={(e) => setFighterForm({ ...fighterForm, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fighterDob">Date of Birth</Label>
                          <Input
                            id="fighterDob"
                            type="date"
                            value={fighterForm.dateOfBirth}
                            onChange={(e) => setFighterForm({ ...fighterForm, dateOfBirth: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fighterCountry">Country</Label>
                          <Input
                            id="fighterCountry"
                            placeholder="Enter country"
                            value={fighterForm.country}
                            onChange={(e) => setFighterForm({ ...fighterForm, country: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fighterPassportNumber">Passport Number</Label>
                          <Input
                            id="fighterPassportNumber"
                            placeholder="Enter passport number"
                            value={fighterForm.passportNumber}
                            onChange={(e) => setFighterForm({ ...fighterForm, passportNumber: e.target.value })}
                          />
                        </div>
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

                      <div className="space-y-2">
                        <Label>Training Seminar Participation</Label>
                        <Select
                          value={fighterForm.trainingSeminar}
                          onValueChange={(value) => setFighterForm({ ...fighterForm, trainingSeminar: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Will participate or not" />
                          </SelectTrigger>
                          <SelectContent>
                            {TRAINING_SEMINAR_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Dan Test</Label>
                        <Select
                          value={fighterForm.danTestParticipation}
                          onValueChange={(value) => setFighterForm({
                            ...fighterForm,
                            danTestParticipation: value,
                            danTestQualificationNumber: value === 'Yes' ? fighterForm.danTestQualificationNumber : '',
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Will join Dan Test or not" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {fighterForm.danTestParticipation === 'Yes' && (
                        <div className="space-y-2">
                          <Label htmlFor="fighterDanTestQualificationNumber">Black Belt Card Number or 1 Kyu Certificate Number</Label>
                          <Input
                            id="fighterDanTestQualificationNumber"
                            placeholder="Enter black belt card number or 1 kyu certificate number"
                            value={fighterForm.danTestQualificationNumber}
                            onChange={(e) => setFighterForm({ ...fighterForm, danTestQualificationNumber: e.target.value })}
                            required
                          />
                        </div>
                      )}

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

                      {/* Tournament History */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Tournament History</Label>
                          <Button type="button" variant="outline" size="sm" onClick={addTournamentEntry}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Tournament
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Achievement is required. If none, write N/A.
                        </p>

                        <div className="space-y-3">
                          {tournamentEntries.map((entry, index) => (
                            <Card key={`tournament-${index}`}>
                              <CardContent className="pt-4 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-sm font-medium">Tournament {index + 1}</p>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTournamentEntry(index)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`tournamentName-${index}`}>Tournament Name *</Label>
                                    <Input
                                      id={`tournamentName-${index}`}
                                      placeholder="e.g., National Kyokushin Open 2025"
                                      value={entry.tournamentName}
                                      onChange={(e) =>
                                        updateTournamentEntry(index, 'tournamentName', e.target.value)
                                      }
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`achievement-${index}`}>Achievement *</Label>
                                    <Input
                                      id={`achievement-${index}`}
                                      placeholder="e.g., Gold Medal or N/A"
                                      value={entry.achievement}
                                      onChange={(e) =>
                                        updateTournamentEntry(index, 'achievement', e.target.value)
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
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

          {/* Branch Chief / Dojo Operator Tab */}
          <TabsContent value="branch-chief-details">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Branch Chief / Dojo Operator</CardTitle>
                  <CardDescription>Submit branch chief or dojo operator details</CardDescription>
                </div>
                <Dialog
                  open={branchChiefDetailDialogOpen}
                  onOpenChange={(open) => {
                    setBranchChiefDetailDialogOpen(open);
                    if (!open) resetBranchChiefDetailForm();
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Branch Chief / Dojo Operator Details</DialogTitle>
                      <DialogDescription>
                        Fill in the profile and document details.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitBranchChiefDetail} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Role *</Label>
                        <Select
                          value={branchChiefDetailForm.operatorRole}
                          onValueChange={(value) => setBranchChiefDetailForm({ ...branchChiefDetailForm, operatorRole: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Branch Chief">Branch Chief</SelectItem>
                            <SelectItem value="Dojo Operator">Dojo Operator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Photo Upload</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden bg-muted">
                            {branchChiefDetailPhotoPreview ? (
                              <img src={branchChiefDetailPhotoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-10 w-10 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              ref={branchChiefDetailPhotoInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleBranchChiefDetailPhotoChange}
                              className="hidden"
                              id="branch-chief-detail-photo"
                            />
                            <Button type="button" variant="outline" onClick={() => branchChiefDetailPhotoInputRef.current?.click()}>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Photo
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Passport Upload</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden bg-muted">
                            {branchChiefDetailPassportPreview ? (
                              <img src={branchChiefDetailPassportPreview} alt="Passport preview" className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              ref={branchChiefDetailPassportInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleBranchChiefDetailPassportChange}
                              className="hidden"
                              id="branch-chief-detail-passport"
                            />
                            <Button type="button" variant="outline" onClick={() => branchChiefDetailPassportInputRef.current?.click()}>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Passport
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branchChiefDetailName">Name *</Label>
                        <Input
                          id="branchChiefDetailName"
                          value={branchChiefDetailForm.fullName}
                          onChange={(e) => setBranchChiefDetailForm({ ...branchChiefDetailForm, fullName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branchChiefDetailAddress">Address</Label>
                        <Textarea
                          id="branchChiefDetailAddress"
                          value={branchChiefDetailForm.address}
                          onChange={(e) => setBranchChiefDetailForm({ ...branchChiefDetailForm, address: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="branchChiefCardNo">Branch Chief Card Number</Label>
                          <Input
                            id="branchChiefCardNo"
                            value={branchChiefDetailForm.branchChiefCardNumber}
                            onChange={(e) => setBranchChiefDetailForm({ ...branchChiefDetailForm, branchChiefCardNumber: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="branchChiefIntlReg">International Reg Number</Label>
                          <Input
                            id="branchChiefIntlReg"
                            value={branchChiefDetailForm.internationalRegistrationNumber}
                            onChange={(e) => setBranchChiefDetailForm({ ...branchChiefDetailForm, internationalRegistrationNumber: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="branchChiefCountry">Country</Label>
                          <Input
                            id="branchChiefCountry"
                            value={branchChiefDetailForm.country}
                            onChange={(e) => setBranchChiefDetailForm({ ...branchChiefDetailForm, country: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="branchChiefPhone">Phone</Label>
                          <Input
                            id="branchChiefPhone"
                            value={branchChiefDetailForm.phone}
                            onChange={(e) => setBranchChiefDetailForm({ ...branchChiefDetailForm, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branchChiefEmail">Email</Label>
                        <Input
                          id="branchChiefEmail"
                          type="email"
                          value={branchChiefDetailForm.email}
                          onChange={(e) => setBranchChiefDetailForm({ ...branchChiefDetailForm, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Training Seminar Participation</Label>
                        <Select
                          value={branchChiefDetailForm.trainingSeminar}
                          onValueChange={(value) => setBranchChiefDetailForm({ ...branchChiefDetailForm, trainingSeminar: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Will participate or not" />
                          </SelectTrigger>
                          <SelectContent>
                            {TRAINING_SEMINAR_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Dan Test</Label>
                        <Select
                          value={branchChiefDetailForm.danTestParticipation}
                          onValueChange={(value) => setBranchChiefDetailForm({
                            ...branchChiefDetailForm,
                            danTestParticipation: value,
                            danTestQualificationNumber: value === 'Yes' ? branchChiefDetailForm.danTestQualificationNumber : '',
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Will join Dan Test or not" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {branchChiefDetailForm.danTestParticipation === 'Yes' && (
                        <div className="space-y-2">
                          <Label htmlFor="branchChiefDanTestQualificationNumber">Black Belt Card Number or 1 Kyu Certificate Number</Label>
                          <Input
                            id="branchChiefDanTestQualificationNumber"
                            placeholder="Enter black belt card number or 1 kyu certificate number"
                            value={branchChiefDetailForm.danTestQualificationNumber}
                            onChange={(e) => setBranchChiefDetailForm({ ...branchChiefDetailForm, danTestQualificationNumber: e.target.value })}
                            required
                          />
                        </div>
                      )}

                      <Button type="submit" className="w-full" disabled={branchChiefDetailSubmitting}>
                        {branchChiefDetailSubmitting ? 'Submitting...' : 'Submit Details'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Dan Test</TableHead>
                      <TableHead>Training Seminar</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branchChiefDetails.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.operator_role || '-'}</TableCell>
                        <TableCell className="font-medium">{entry.full_name}</TableCell>
                        <TableCell>{entry.country || '-'}</TableCell>
                        <TableCell>{entry.phone || '-'}</TableCell>
                        <TableCell>{entry.email || '-'}</TableCell>
                        <TableCell>{entry.dan_test_participation || '-'}</TableCell>
                        <TableCell>{entry.training_seminar || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBranchChiefDetail(entry.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {branchChiefDetails.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No entries yet. Click &quot;Add Details&quot; to submit one.
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
