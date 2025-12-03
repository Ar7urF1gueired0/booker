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
  onValuesChange?: (values: Record<string, string>) => void;
  renderFieldSlot?: (field: ModalFormField, value: string) => React.ReactNode;
  isSubmitDisabled?: boolean;
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
  onValuesChange,
  renderFieldSlot,
  isSubmitDisabled = false,
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
    if (onValuesChange) {
      onValuesChange(initialValues);
    }
  }, [initialValues, isOpen, onValuesChange]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: string) => {
    setValues(prev => {
      const nextValues = { ...prev, [name]: value };
      if (onValuesChange) {
        onValuesChange(nextValues);
      }
      return nextValues;
    });
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
          onChange={e => handleChange(field.name, e.target.value)}
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
          onChange={e => handleChange(field.name, e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-cyan-500 focus:outline-none"
        >
          <option value="">Selecione...</option>
          {field.options?.map(option => (
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
        onChange={e => handleChange(field.name, e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-cyan-500 focus:outline-none"
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header - fixo no topo */}
        <div className="flex items-start justify-between gap-4 p-4 sm:p-6 pb-0 sm:pb-0 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>}
          </div>
          {onClose && (
            <button
              type="button"
              aria-label="Fechar modal"
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 shrink-0"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-4">
          {bodyText && <p className="text-sm text-gray-700">{bodyText}</p>}

          {children && <div className="mt-4">{children}</div>}

          {formSchema && (
            <form className="space-y-4" onSubmit={handleSubmit} id="modal-form">
              {formSchema.fields.map(field => (
                <div key={field.name} className="space-y-1">
                  <label
                    htmlFor={field.name}
                    className="text-xs sm:text-sm font-semibold text-gray-700"
                  >
                    {field.label}
                  </label>
                  {renderField(field)}
                  {field.description && (
                    <p className="text-xs text-gray-500">{field.description}</p>
                  )}
                  {renderFieldSlot && renderFieldSlot(field, values[field.name] ?? '')}
                </div>
              ))}
            </form>
          )}
        </div>

        {/* Footer com botões - fixo no rodapé */}
        {formSchema && (
          <div className="flex justify-end gap-3 p-4 sm:p-6 pt-4 border-t border-gray-100 shrink-0">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-gray-200 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              form="modal-form"
              disabled={isSubmitDisabled}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold text-white transition ${
                isSubmitDisabled
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
            >
              {formSchema.submitLabel ?? 'Salvar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
