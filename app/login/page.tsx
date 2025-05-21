'use client';

import { login, signup, resetPassword } from './action';
import Image from 'next/image';
import { useState } from 'react';

export default function LoginPage() {
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ success?: boolean; error?: string } | null>(null);

  const handleResetPassword = async (formData: FormData) => {
    const result = await resetPassword(formData);
    setResetStatus(result);
    if (result.success) {
      setTimeout(() => {
        setShowResetForm(false);
        setResetStatus(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div>
        <Image 
          alt="background"
          src="/cartons.jpg"
          quality={100}
          fill
          className="object-cover blur-xs"
          priority
        />
      </div>
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8 border border-white/20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6 overflow-hidden">
            <Image
              src="/vercel.svg" 
              alt="Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Bienvenue sur Mayliss</h1>
        </div>

        {!showResetForm ? (
          <>
            <form className="space-y-6">
              <div className="space-y-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  formAction={login}
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                >
                  Se connecter
                </button>
                
                <button
                  formAction={signup}
                  className="w-full py-3 px-4 bg-white text-indigo-600 rounded-lg font-medium border border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                >
                  Créer un compte
                </button>
              </div>
            </form>

            <div className="text-center">
              <button
                onClick={() => setShowResetForm(true)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </>
        ) : (
          <form action={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <input
                type="email"
                name="email"
                placeholder="Entrez votre email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            {resetStatus && (
              <div className={`p-3 rounded-lg ${resetStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {resetStatus.success 
                  ? 'Un email de réinitialisation a été envoyé à votre adresse email.'
                  : resetStatus.error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
              >
                Réinitialiser le mot de passe
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowResetForm(false);
                  setResetStatus(null);
                }}
                className="w-full py-3 px-4 bg-white text-indigo-600 rounded-lg font-medium border border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}