"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Loader2, Check } from "lucide-react";

const steps = [
    { id: "identity", title: "Who are you?", desc: "Let's start with the basics." },
    { id: "body", title: "Body Metrics", desc: "For accurate health analysis." },
    { id: "health", title: "Health Profile", desc: "Any existing conditions?" },
    { id: "goals", title: "Your Goals", desc: "What do you want to achieve?" },
];

export default function OnboardingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        dob: "",
        gender: "",
        height: "", // cm
        weight: "", // kg
        conditions: [] as string[],
        goals: "",
        activityLevel: "",
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        try {
            await setDoc(doc(db, "users", user.uid), {
                profile: {
                    ...formData,
                    completedOnboarding: true,
                },
                createdAt: new Date().toISOString(),
                email: user.email,
                displayName: user.displayName,
            });
            router.push("/dashboard");
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleCondition = (condition: string) => {
        setFormData((prev) => {
            const exists = prev.conditions.includes(condition);
            return {
                ...prev,
                conditions: exists
                    ? prev.conditions.filter((c) => c !== condition)
                    : [...prev.conditions, condition],
            };
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 pt-20">
            <div className="w-full max-w-2xl space-y-8">

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium text-muted-foreground">
                        <span>Step {currentStep + 1} of {steps.length}</span>
                        <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-2xl border bg-card p-8 shadow-lg glass-panel min-h-[400px] flex flex-col justify-between"
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold">{steps[currentStep].title}</h1>
                            <p className="text-muted-foreground">{steps[currentStep].desc}</p>
                        </div>

                        {/* Step 1: Identity */}
                        {currentStep === 0 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Date of Birth</Label>
                                    <Input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => updateField("dob", e.target.value)}
                                        className="bg-secondary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <div className="flex gap-4">
                                        {["Male", "Female", "Other"].map((g) => (
                                            <Button
                                                key={g}
                                                type="button"
                                                variant={formData.gender === g ? "default" : "outline"}
                                                onClick={() => updateField("gender", g)}
                                                className="flex-1"
                                            >
                                                {g}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Body Metrics */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Height (cm)</Label>
                                        <Input
                                            type="number"
                                            placeholder="175"
                                            value={formData.height}
                                            onChange={(e) => updateField("height", e.target.value)}
                                            className="bg-secondary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Weight (kg)</Label>
                                        <Input
                                            type="number"
                                            placeholder="70"
                                            value={formData.weight}
                                            onChange={(e) => updateField("weight", e.target.value)}
                                            className="bg-secondary/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Health Profile */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <Label>Do you have any of these conditions?</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Diabetes", "Hypertension", "Asthma", "Insomnia", "Anxiety", "None"].map((c) => (
                                        <div
                                            key={c}
                                            onClick={() => toggleCondition(c)}
                                            className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${formData.conditions.includes(c)
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "hover:bg-secondary/50"
                                                }`}
                                        >
                                            {c}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Goals */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label>Primary Goal</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={formData.goals}
                                        onChange={(e) => updateField("goals", e.target.value)}
                                    >
                                        <option value="">Select a goal...</option>
                                        <option value="lose_weight">Lose Weight</option>
                                        <option value="maintain">Maintain Health</option>
                                        <option value="muscle">Build Muscle</option>
                                        <option value="energy">Improve Energy</option>
                                        <option value="stress">Reduce Stress</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <Label>Activity Level</Label>
                                    <div className="space-y-2">
                                        {[
                                            { val: "sedentary", label: "Sedentary (Office job)" },
                                            { val: "active", label: "Active (Daily exercise)" },
                                            { val: "athlete", label: "Athlete (Intense training)" },
                                        ].map((opt) => (
                                            <div
                                                key={opt.val}
                                                onClick={() => updateField("activityLevel", opt.val)}
                                                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${formData.activityLevel === opt.val
                                                        ? "border-primary bg-primary/10"
                                                        : "hover:bg-secondary/50"
                                                    }`}
                                            >
                                                <span>{opt.label}</span>
                                                {formData.activityLevel === opt.val && <Check className="h-4 w-4 text-primary" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between pt-8">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 0 || loading}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>

                        <Button onClick={handleNext} disabled={loading} className="px-8">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : currentStep === steps.length - 1 ? (
                                "Finish Setup"
                            ) : (
                                <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
