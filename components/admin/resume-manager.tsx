"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Briefcase, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ResumeData, ExperienceItem, EducationItem, SkillCategory } from "@/lib/resume-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResumeManager() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await fetch("/api/v1/resume");
      const result = await response.json();
      if (result.success) {
        setResumeData(result.data || {
          summary: { tr: "", en: "" },
          experience: [],
          education: [],
          skills: [],
        });
      } else {
        toast.error(result.error || "Özgeçmiş verileri yüklenemedi");
      }
    } catch (error) {
      toast.error("Bağlantı hatası");
      console.error("Resume fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!resumeData) return;

    setSaving(true);
    try {
      const response = await fetch("/api/v1/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Özgeçmiş başarıyla kaydedildi");
        fetchResume();
      } else {
        toast.error(result.error || "Kaydetme başarısız");
        if (result.details) {
          console.error("Hata detayları:", result.details);
        }
      }
    } catch (error) {
      toast.error("Bağlantı hatası");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateSummary = (lang: "tr" | "en", value: string) => {
    if (!resumeData) return;
    setResumeData({
      ...resumeData,
      summary: {
        ...resumeData.summary,
        [lang]: value,
      },
    });
  };

  const addExperience = () => {
    if (!resumeData) return;
    const newExp: ExperienceItem = {
      id: Date.now().toString(),
      title: { tr: "", en: "" },
      company: { tr: "", en: "" },
      location: { tr: "", en: "" },
      period: { tr: "", en: "" },
      description: { tr: "", en: "" },
    };
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExp],
    });
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    if (!resumeData) return;
    const updated = [...resumeData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setResumeData({ ...resumeData, experience: updated });
  };

  const removeExperience = (index: number) => {
    if (!resumeData) return;
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    if (!resumeData) return;
    const newEdu: EducationItem = {
      id: Date.now().toString(),
      degree: { tr: "", en: "" },
      institution: { tr: "", en: "" },
      location: { tr: "", en: "" },
      period: { tr: "", en: "" },
      description: { tr: "", en: "" },
    };
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEdu],
    });
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: any) => {
    if (!resumeData) return;
    const updated = [...resumeData.education];
    updated[index] = { ...updated[index], [field]: value };
    setResumeData({ ...resumeData, education: updated });
  };

  const removeEducation = (index: number) => {
    if (!resumeData) return;
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((_, i) => i !== index),
    });
  };

  const addSkill = () => {
    if (!resumeData) return;
    const newSkill: SkillCategory = {
      id: Date.now().toString(),
      category: { tr: "", en: "" },
      items: [],
    };
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill],
    });
  };

  const updateSkill = (index: number, field: keyof SkillCategory, value: any) => {
    if (!resumeData) return;
    const updated = [...resumeData.skills];
    updated[index] = { ...updated[index], [field]: value };
    setResumeData({ ...resumeData, skills: updated });
  };

  const removeSkill = (index: number) => {
    if (!resumeData) return;
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>;
  }

  if (!resumeData) {
    return <div className="text-center py-8 text-muted-foreground">Veri yüklenemedi</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Özgeçmiş Yönetimi
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Özgeçmiş bilgilerinizi buradan yönetin
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-1">
          <TabsTrigger value="summary">Özet</TabsTrigger>
          <TabsTrigger value="experience">Deneyim</TabsTrigger>
          <TabsTrigger value="education">Eğitim</TabsTrigger>
          <TabsTrigger value="skills">Yetenekler</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Özet</CardTitle>
              <CardDescription>Profesyonel özetinizi yazın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Türkçe Özet</Label>
                <Textarea
                  value={resumeData.summary.tr}
                  onChange={(e) => updateSummary("tr", e.target.value)}
                  placeholder="Profesyonel özetinizi yazın..."
                  className="min-h-[120px]"
                />
              </div>
              <div>
                <Label>İngilizce Özet</Label>
                <Textarea
                  value={resumeData.summary.en}
                  onChange={(e) => updateSummary("en", e.target.value)}
                  placeholder="Write your professional summary..."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <CardTitle>İş Deneyimi</CardTitle>
            <Button onClick={addExperience} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Deneyim Ekle
            </Button>
          </div>
          {resumeData.experience.map((exp, index) => (
            <Card key={exp.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Deneyim {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>TR Başlık</Label>
                    <Input
                      value={exp.title.tr}
                      onChange={(e) =>
                        updateExperience(index, "title", {
                          ...exp.title,
                          tr: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>EN Title</Label>
                    <Input
                      value={exp.title.en}
                      onChange={(e) =>
                        updateExperience(index, "title", {
                          ...exp.title,
                          en: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>TR Şirket</Label>
                    <Input
                      value={exp.company.tr}
                      onChange={(e) =>
                        updateExperience(index, "company", {
                          ...exp.company,
                          tr: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>EN Company</Label>
                    <Input
                      value={exp.company.en}
                      onChange={(e) =>
                        updateExperience(index, "company", {
                          ...exp.company,
                          en: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>TR Dönem</Label>
                    <Input
                      value={exp.period.tr}
                      onChange={(e) =>
                        updateExperience(index, "period", {
                          ...exp.period,
                          tr: e.target.value,
                        })
                      }
                      placeholder="2020-2022 veya Devam Ediyor"
                    />
                  </div>
                  <div>
                    <Label>EN Period</Label>
                    <Input
                      value={exp.period.en}
                      onChange={(e) =>
                        updateExperience(index, "period", {
                          ...exp.period,
                          en: e.target.value,
                        })
                      }
                      placeholder="2020-2022 or Ongoing"
                    />
                  </div>
                </div>
                <div>
                  <Label>TR Açıklama</Label>
                  <Textarea
                    value={exp.description.tr}
                    onChange={(e) =>
                      updateExperience(index, "description", {
                        ...exp.description,
                        tr: e.target.value,
                      })
                    }
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <Label>EN Description</Label>
                  <Textarea
                    value={exp.description.en}
                    onChange={(e) =>
                      updateExperience(index, "description", {
                        ...exp.description,
                        en: e.target.value,
                      })
                    }
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <CardTitle>Eğitim</CardTitle>
            <Button onClick={addEducation} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Eğitim Ekle
            </Button>
          </div>
          {resumeData.education.map((edu, index) => (
            <Card key={edu.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Eğitim {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>TR Derece</Label>
                    <Input
                      value={edu.degree.tr}
                      onChange={(e) =>
                        updateEducation(index, "degree", {
                          ...edu.degree,
                          tr: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>EN Degree</Label>
                    <Input
                      value={edu.degree.en}
                      onChange={(e) =>
                        updateEducation(index, "degree", {
                          ...edu.degree,
                          en: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>TR Kurum</Label>
                    <Input
                      value={edu.institution.tr}
                      onChange={(e) =>
                        updateEducation(index, "institution", {
                          ...edu.institution,
                          tr: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>EN Institution</Label>
                    <Input
                      value={edu.institution.en}
                      onChange={(e) =>
                        updateEducation(index, "institution", {
                          ...edu.institution,
                          en: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>TR Dönem</Label>
                    <Input
                      value={edu.period.tr}
                      onChange={(e) =>
                        updateEducation(index, "period", {
                          ...edu.period,
                          tr: e.target.value,
                        })
                      }
                      placeholder="2020-2024"
                    />
                  </div>
                  <div>
                    <Label>EN Period</Label>
                    <Input
                      value={edu.period.en}
                      onChange={(e) =>
                        updateEducation(index, "period", {
                          ...edu.period,
                          en: e.target.value,
                        })
                      }
                      placeholder="2020-2024"
                    />
                  </div>
                </div>
                <div>
                  <Label>TR Açıklama</Label>
                  <Textarea
                    value={edu.description.tr}
                    onChange={(e) =>
                      updateEducation(index, "description", {
                        ...edu.description,
                        tr: e.target.value,
                      })
                    }
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <Label>EN Description</Label>
                  <Textarea
                    value={edu.description.en}
                    onChange={(e) =>
                      updateEducation(index, "description", {
                        ...edu.description,
                        en: e.target.value,
                      })
                    }
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <CardTitle>Yetenekler</CardTitle>
            <Button onClick={addSkill} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Kategori Ekle
            </Button>
          </div>
          {resumeData.skills.map((skill, index) => (
            <Card key={skill.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Yetenek Kategorisi {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>TR Kategori Adı</Label>
                    <Input
                      value={skill.category.tr}
                      onChange={(e) =>
                        updateSkill(index, "category", {
                          ...skill.category,
                          tr: e.target.value,
                        })
                      }
                      placeholder="Tasarım Araçları"
                    />
                  </div>
                  <div>
                    <Label>EN Category Name</Label>
                    <Input
                      value={skill.category.en}
                      onChange={(e) =>
                        updateSkill(index, "category", {
                          ...skill.category,
                          en: e.target.value,
                        })
                      }
                      placeholder="Design Tools"
                    />
                  </div>
                </div>
                <div>
                  <Label>Yetenekler (virgülle ayırın)</Label>
                  <Input
                    value={skill.items.join(", ")}
                    onChange={(e) =>
                      updateSkill(
                        index,
                        "items",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    placeholder="Photoshop, Illustrator, Figma"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
