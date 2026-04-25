import { FormErrors } from '@/utils/validation';
import { useCallback, useState } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  validationRules: Record<keyof T, (value: string, allValues: T) => string>;
  onSubmit: (values: T) => void | Promise<void>;
  onValidationFail?: (errors: FormErrors) => void;
}

export const useForm = <T extends Record<string, string>>({
  initialValues,
  validationRules,
  onSubmit,
  onValidationFail,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValues).reduce((acc, key) => ({
      ...acc,
      [key]: false,
    }), {} as Record<keyof T, boolean>)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleChange = useCallback((field: keyof T, value: string) => {
    setValues(prev => {
      const newValues = { ...prev, [field]: value };
      return newValues;
    });

    //  Always re-validate if there's an existing error (don't check touched)
    setErrors(prev => {
      if (prev[field as string] !== undefined && prev[field as string] !== '') {
        const validateField = validationRules[field];
        if (validateField) {
          const currentValues = { ...values, [field]: value } as T;
          const error = validateField(value, currentValues);
          return { ...prev, [field]: error };
        }
      }
      return prev;
    });
  }, [values, validationRules]);



  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    setValues(currentValues => {
      const validateField = validationRules[field];
      if (validateField) {
        const error = validateField(currentValues[field] || '', currentValues);
        setErrors(prev => ({ ...prev, [field]: error }));
      }
      return currentValues;
    });
  }, [validationRules]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true,
    }), {} as Record<keyof T, boolean>);
    setTouched(allTouched);

    // Validate all fields, passing allValues for cross-field rules
    const validationErrors: FormErrors = {};
    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key as keyof T](values[key] || '', values);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      onValidationFail?.(validationErrors);
      setIsSubmitting(false);
      return;
    }

    //  Clear all errors before submitting
    setErrors({});

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationRules, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(Object.keys(initialValues).reduce((acc, key) => ({
      ...acc,
      [key]: false,
    }), {} as Record<keyof T, boolean>));
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  };
};