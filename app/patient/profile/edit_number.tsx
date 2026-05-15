import { ContactChangedSuccessScreen } from '@/components/edit_contact/ContactChangedSuccessScreen'
import { EditContactNumberScreen } from '@/components/edit_contact/EditContactNumberScreen'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Step = 'edit_number' | 'success'

export default function EditContactFlowScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('edit_number')

  if (step === 'edit_number') {
    return (
      <EditContactNumberScreen
        onSuccess={() => setStep('success')}
      />
    )
  }

  return <ContactChangedSuccessScreen onContinue={() => router.back()} />
}