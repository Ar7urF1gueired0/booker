'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'date' | 'password';

export type ModalFormField = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  description?: string;
  defaultValue?: string;
  options?: Array<{ label: string; value: string }>;
  value?: any;
};

// Estrutura que pode ser montada como JSON externo e injetada no modal
export type ModalFormSchema = {
  fields: ModalFormField[];
  submitLabel?: string;
};

type ModalProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  bodyText?: string;
  formSchema?: ModalFormSchema;
  onSubmit?: (values: Record<string, string>) => void;
  onClose?: () => void;
  children?: React.ReactNode; // Conteúdo customizado opcional (formulário externo ou qualquer JSX)
};

export function Modal({
  isOpen,
  title,
  subtitle,
  bodyText,
  formSchema,
  onSubmit,
  onClose,
  children,
}: ModalProps) {
  const initialValues = useMemo(() => {
    if (!formSchema) return {};
    return formSchema.fields.reduce<Record<string, string>>((acc, field) => {
      acc[field.name] = field.defaultValue ?? '';
      return acc;
    }, {});
  }, [formSchema]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const renderField = (field: ModalFormField) => {
    if (field.type === 'textarea') {
      return (
        <textarea
          id={field.name}
          name={field.name}
          required={field.required}
          placeholder={field.placeholder}
          value={values[field.name] ?? ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-cyan-500 focus:outline-none"
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          value={values[field.name] ?? ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-cyan-500 focus:outline-none"
        >
          <option value="">Selecione...</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        required={field.required}
        placeholder={field.placeholder}
        value={values[field.name] ?? ''}
        onChange={(e) => handleChange(field.name, e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-cyan-500 focus:outline-none"
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {onClose && (
            <button
              type="button"
              aria-label="Fechar modal"
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {bodyText && <p className="mt-4 text-sm text-gray-700">{bodyText}</p>}

        {children && <div className="mt-4">{children}</div>}

        {formSchema && (
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            {formSchema.fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label htmlFor={field.name} className="text-sm font-semibold text-gray-700">
                  {field.label}
                </label>
                {renderField(field)}
                {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-2">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-cyan-600"
              >
                {formSchema.submitLabel ?? 'Salvar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
