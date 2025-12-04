'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, ShieldCheck, Hash } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';

import { Modal, type ModalFormField, type ModalFormSchema } from '@/components/Modal';
import { useAuth } from '@/hooks/useAuth';

const getInitials = (fullName?: string | null) => {
  if (!fullName) return '?';
  const parts = fullName
    .split(' ')
    .map(part => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

type PreviewStatus = 'idle' | 'loading' | 'error' | 'success';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoFormValues, setPhotoFormValues] = useState<Record<string, string>>({
    photoUrl: user?.photoUrl ?? '',
  });
  const [photoPreviewStatus, setPhotoPreviewStatus] = useState<PreviewStatus>('idle');
  const [photoPreviewSrc, setPhotoPreviewSrc] = useState('');
  const [photoValidationError, setPhotoValidationError] = useState('');
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const [isSavingHands, setIsSavingHands] = useState(false);

  useEffect(() => {
    if (!isPhotoModalOpen) {
      setPhotoFormValues({ photoUrl: user?.photoUrl ?? '' });
    }
  }, [isPhotoModalOpen, user?.photoUrl]);

  // Handedness state
  const [forehandSelection, setForehandSelection] = useState<'RIGHT' | 'LEFT' | null>(
    (user?.forehand as 'RIGHT' | 'LEFT') ?? null
  );
  const [backhandSelection, setBackhandSelection] = useState<'ONE_HAND' | 'TWO_HANDS' | null>(
    (user?.backhand as 'ONE_HAND' | 'TWO_HANDS') ?? null
  );

  useEffect(() => {
    setForehandSelection((user?.forehand as 'RIGHT' | 'LEFT') ?? null);
    setBackhandSelection((user?.backhand as 'ONE_HAND' | 'TWO_HANDS') ?? null);
  }, [user?.forehand, user?.backhand]);

  useEffect(() => {
    if (!isPhotoModalOpen) return;
    const url = (photoFormValues.photoUrl ?? '').trim();

    if (!url) {
      setPhotoPreviewStatus('idle');
      setPhotoPreviewSrc('');
      setPhotoValidationError('');
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      setPhotoPreviewStatus('error');
      setPhotoValidationError('Informe uma URL válida iniciada com http ou https');
      setPhotoPreviewSrc('');
      return;
    }

    let cancelled = false;
    const image = new window.Image();
    setPhotoPreviewStatus('loading');
    setPhotoValidationError('');
    image.onload = () => {
      if (cancelled) return;
      setPhotoPreviewStatus('success');
      setPhotoPreviewSrc(url);
    };
    image.onerror = () => {
      if (cancelled) return;
      setPhotoPreviewStatus('error');
      setPhotoValidationError('Não foi possível carregar a imagem deste link');
      setPhotoPreviewSrc('');
    };
    image.src = url;

    return () => {
      cancelled = true;
    };
  }, [photoFormValues.photoUrl, isPhotoModalOpen]);

  const handleOpenPhotoModal = () => {
    setPhotoFormValues({ photoUrl: user?.photoUrl ?? '' });
    setPhotoPreviewSrc(user?.photoUrl ?? '');
    setPhotoPreviewStatus(user?.photoUrl ? 'loading' : 'idle');
    setPhotoValidationError('');
    setIsPhotoModalOpen(true);
  };

  const handleClosePhotoModal = () => {
    setIsPhotoModalOpen(false);
    setPhotoPreviewStatus('idle');
    setPhotoPreviewSrc('');
    setPhotoValidationError('');
    setIsSavingPhoto(false);
  };

  const handlePhotoValuesChange = useCallback((values: Record<string, string>) => {
    setPhotoFormValues(values);
  }, []);

  const handlePhotoSubmit = async (values: Record<string, string>) => {
    const photoUrl = (values.photoUrl ?? '').trim();
    if (!photoUrl) {
      setPhotoValidationError('Informe o link da imagem');
      setPhotoPreviewStatus('error');
      return;
    }

    if (photoPreviewStatus !== 'success') {
      setPhotoValidationError('Valide a imagem antes de salvar');
      setPhotoPreviewStatus('error');
      return;
    }

    try {
      setIsSavingPhoto(true);
      await updateProfile({ photoUrl });
      enqueueSnackbar('Foto atualizada com sucesso!', { variant: 'success' });
      handleClosePhotoModal();
    } catch (error: any) {
      const message = error?.message ?? 'Não foi possível atualizar a foto';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const infoRows = [
    {
      label: 'Nome completo',
      value: user?.fullName ?? 'Não informado',
    },
    {
      label: 'E-mail',
      value: user?.email ?? 'Não informado',
      icon: <Mail size={16} className="text-cyan-500" />,
    },
    {
      label: 'Identificador',
      value: user ? `#${user.id}` : 'Não disponível',
      icon: <Hash size={16} className="text-cyan-500" />,
    },
    {
      label: 'Nível de acesso',
      value: user?.role === 'ADMIN' ? 'Administrador' : 'Atleta',
      icon: <ShieldCheck size={16} className="text-cyan-500" />,
    },
  ];

  const handleSaveHands = async () => {
    if (!user) return;
    setIsSavingHands(true);
    try {
      await updateProfile({
        forehand: forehandSelection ?? undefined,
        backhand: backhandSelection ?? undefined,
      });
      enqueueSnackbar('Preferência de mão salva com sucesso!', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err?.message ?? 'Falha ao salvar preferência', { variant: 'error' });
    } finally {
      setIsSavingHands(false);
    }
  };

  const photoModalSchema = useMemo<ModalFormSchema>(
    () => ({
      submitLabel: isSavingPhoto ? 'Salvando...' : 'Salvar foto',
      fields: [
        {
          name: 'photoUrl',
          label: 'Link da imagem',
          type: 'text',
          placeholder: 'https://exemplo.com/sua-foto.jpg',
          required: true,
          defaultValue: user?.photoUrl ?? '',
          description: 'Utilize um link público (HTTP/HTTPS)',
        },
      ],
    }),
    [isSavingPhoto, user?.photoUrl]
  );

  const renderPhotoFieldSlot = (field: ModalFormField, value: string) => {
    if (field.name !== 'photoUrl') {
      return null;
    }

    const helperMessage = () => {
      if (photoPreviewStatus === 'loading') return 'Validando imagem...';
      if (photoPreviewStatus === 'error')
        return photoValidationError || 'Não foi possível validar.';
      if (!value) return 'Cole um link público para visualizar sua foto.';
      if (photoPreviewStatus === 'idle') return 'Aguardando validação do link.';
      return '';
    };

    return (
      <div className="space-y-2">
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-3 flex items-center justify-center">
          {photoPreviewStatus === 'success' ? (
            <div className="relative h-48 w-full overflow-hidden rounded-xl">
              <Image
                src={photoPreviewSrc}
                alt="Pré-visualização da foto de perfil"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 450px"
              />
            </div>
          ) : (
            <span
              className={`text-xs ${
                photoPreviewStatus === 'error' ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {helperMessage()}
            </span>
          )}
        </div>
        {photoPreviewStatus === 'success' && (
          <p className="text-xs text-gray-500 text-center">Pré-visualização validada.</p>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-8 pb-12">
        <section className="rounded-3xl bg-white shadow-sm overflow-hidden">
          <div className="h-32 bg-green-200" />

          <div className="px-6 pb-8 -mt-12 flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="flex flex-col items-center sm:items-start">
              <button
                type="button"
                onClick={handleOpenPhotoModal}
                title="Alterar foto de perfil"
                className="group relative w-28 h-28 rounded-3xl border-4 border-white bg-gray-100 shadow-xl overflow-hidden shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                {user?.photoUrl ? (
                  <Image
                    src={user.photoUrl}
                    alt={user?.fullName ?? 'Foto do usuário'}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-50">
                    <span className="text-3xl font-semibold text-gray-500">
                      {getInitials(user?.fullName)}
                    </span>
                  </div>
                )}
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl bg-black/20 text-[11px] font-semibold uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100">
                  Alterar foto
                </span>
              </button>
              <span className="mt-2 text-xs text-gray-500">Clique na foto para atualizar</span>
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Perfil</p>
              <h1 className="text-3xl font-bold text-gray-900">{user?.fullName ?? 'Usuário'}</h1>
              <p className="text-sm text-gray-500">{user?.email ?? 'E-mail não informado'}</p>

              <div className="mt-4 inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
                {user?.role === 'ADMIN' ? 'Administrador' : 'Atleta'}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Dados disponíveis
              </p>
              <h2 className="text-xl font-bold text-gray-900">Informações básicas</h2>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {infoRows.map(row => (
              <div
                key={row.label}
                className="rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 flex items-center gap-2">
                  {row.icon}
                  {row.label}
                </dt>
                <dd className="mt-1 text-base font-semibold text-gray-800">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Preferência de Mão</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Forehand</dt>
                <div className="mt-2 flex items-center gap-4">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="forehand"
                      value="RIGHT"
                      checked={forehandSelection === 'RIGHT'}
                      onChange={() => setForehandSelection('RIGHT')}
                      className="form-radio"
                    />
                    <span className="text-sm">Direito</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="forehand"
                      value="LEFT"
                      checked={forehandSelection === 'LEFT'}
                      onChange={() => setForehandSelection('LEFT')}
                      className="form-radio"
                    />
                    <span className="text-sm">Esquerdo</span>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Backhand</dt>
                <div className="mt-2 flex items-center gap-4">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="backhand"
                      value="ONE_HAND"
                      checked={backhandSelection === 'ONE_HAND'}
                      onChange={() => setBackhandSelection('ONE_HAND')}
                      className="form-radio"
                    />
                    <span className="text-sm">Uma mão</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="backhand"
                      value="TWO_HANDS"
                      checked={backhandSelection === 'TWO_HANDS'}
                      onChange={() => setBackhandSelection('TWO_HANDS')}
                      className="form-radio"
                    />
                    <span className="text-sm">Duas mãos</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleSaveHands}
                disabled={isSavingHands}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-white font-semibold hover:bg-cyan-600 disabled:opacity-50"
              >
                {isSavingHands ? 'Salvando...' : 'Salvar preferências'}
              </button>
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={isPhotoModalOpen}
        title="Atualizar foto de perfil"
        subtitle={user?.fullName}
        bodyText="Informe um link público (HTTP ou HTTPS) para a nova foto. Mostraremos a pré-visualização automaticamente."
        formSchema={photoModalSchema}
        onSubmit={handlePhotoSubmit}
        onClose={handleClosePhotoModal}
        onValuesChange={handlePhotoValuesChange}
        renderFieldSlot={renderPhotoFieldSlot}
        isSubmitDisabled={isSavingPhoto || photoPreviewStatus !== 'success'}
      />
    </>
  );
}
