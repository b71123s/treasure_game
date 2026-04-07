import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormValues {
  email: string;
  password: string;
  confirmPassword?: string;
}

function SignInForm({ onSuccess }: { onSuccess?: () => void }) {
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({ defaultValues: { email: "", password: "" } });

  async function onSubmit(values: FormValues) {
    setError("");
    setLoading(true);
    try {
      await signIn(values.email, values.password);
      onSuccess?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" rules={{ required: "請輸入 Email" }} render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" rules={{ required: "請輸入密碼", minLength: { value: 8, message: "密碼至少 8 字元" } }} render={({ field }) => (
          <FormItem>
            <FormLabel>密碼</FormLabel>
            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "登入中..." : "登入"}
        </Button>
      </form>
    </Form>
  );
}

function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({ defaultValues: { email: "", password: "", confirmPassword: "" } });

  async function onSubmit(values: FormValues) {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", { message: "密碼不一致" });
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp(values.email, values.password);
      onSuccess?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" rules={{ required: "請輸入 Email" }} render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" rules={{ required: "請輸入密碼", minLength: { value: 8, message: "密碼至少 8 字元" } }} render={({ field }) => (
          <FormItem>
            <FormLabel>密碼</FormLabel>
            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="confirmPassword" rules={{ required: "請再次輸入密碼" }} render={({ field }) => (
          <FormItem>
            <FormLabel>確認密碼</FormLabel>
            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "註冊中..." : "註冊"}
        </Button>
      </form>
    </Form>
  );
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  function handleSuccess() {
    onOpenChange(false);
    onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>帳號</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin">
          <TabsList className="w-full">
            <TabsTrigger value="signin" className="flex-1">登入</TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">註冊</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="mt-4">
            <SignInForm onSuccess={handleSuccess} />
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <SignUpForm onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
