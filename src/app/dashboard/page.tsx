"use client";
import { useAuth } from '@/lib/auth/context'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useAuth();
  const router = useRouter();

  // Не рендеримо нічого під час static generation
  if (typeof window === 'undefined') {
    return null;
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Панель керування</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-lg mb-4">
          Вітаємо, <span className="font-semibold">{user?.name || user?.email}</span>!
        </p>
        <p>Тут будуть ваші події та статистика.</p>
      </div>
    </div>
  );
}
