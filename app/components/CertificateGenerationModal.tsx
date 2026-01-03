"use client";
import { useState, useEffect } from 'react';
import { getAvailableTemplates, previewCertificate, generateUserCertificate } from '@/lib/userCertificateService';
import type { CertificateTemplate } from '@/lib/certificateService';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  recommendedTemplateId?: number;
  onSuccess?: (certificate: any) => void;
}

export default function CertificateGenerationModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  recommendedTemplateId,
  onSuccess
}: CertificateModalProps) {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | undefined>(recommendedTemplateId);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates
  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      if (selectedTemplateId) {
        loadPreview(selectedTemplateId);
      }
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const data = await getAvailableTemplates();
      setTemplates(data);
      
      // Set default template
      if (!selectedTemplateId && recommendedTemplateId) {
        setSelectedTemplateId(recommendedTemplateId);
      } else if (!selectedTemplateId && data.length > 0) {
        setSelectedTemplateId(data[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching templates:', err);
      setError(err.message);
    }
  };

  const loadPreview = async (templateId?: number) => {
    if (!courseId) return;
    
    try {
      setIsLoadingPreview(true);
      setError(null);
      const preview = await previewCertificate(courseId, templateId);
      setPreviewData(preview);
    } catch (err: any) {
      console.error('Error loading preview:', err);
      setError(err.message);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleTemplateChange = (templateId: number) => {
    setSelectedTemplateId(templateId);
    loadPreview(templateId);
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const certificate = await generateUserCertificate({
        course_id: courseId,
        template_id: selectedTemplateId,
        format: 'pdf'
      });

      if (onSuccess) {
        onSuccess(certificate);
      }

      onClose();
    } catch (err: any) {
      console.error('Error generating certificate:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B21FF] to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">🎉 Selamat!</h2>
              <p className="text-purple-100">Anda telah menyelesaikan course <strong>{courseTitle}</strong></p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Pilih Desain Sertifikat
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`relative border-2 rounded-xl p-3 transition-all duration-200 ${
                    selectedTemplateId === template.id
                      ? 'border-[#6B21FF] bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {template.preview_url && (
                    <img
                      src={template.preview_url}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className={`text-sm font-medium text-center ${
                    selectedTemplateId === template.id ? 'text-[#6B21FF]' : 'text-gray-700'
                  }`}>
                    {template.name}
                  </p>
                  {selectedTemplateId === template.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#6B21FF] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Preview Sertifikat
            </label>
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 min-h-[300px] flex items-center justify-center">
              {isLoadingPreview ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B21FF] mb-3"></div>
                  <p className="text-gray-500">Memuat preview...</p>
                </div>
              ) : previewData ? (
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 border-4 border-[#6B21FF]">
                  {previewData.template_url && (
                    <div className="absolute inset-0 opacity-10">
                      <img src={previewData.template_url} alt="Background" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="relative text-center space-y-4">
                    <h3 className="text-3xl font-bold text-[#6B21FF]">SERTIFIKAT</h3>
                    <p className="text-gray-600">Diberikan kepada</p>
                    <p className="text-2xl font-bold text-gray-900">{previewData.recipient_name}</p>
                    <p className="text-gray-600">Telah menyelesaikan course</p>
                    <p className="text-xl font-semibold text-gray-900">{previewData.course_title}</p>
                    <div className="pt-4">
                      <p className="text-sm text-gray-500">Instruktur: {previewData.instructor_name}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Pilih template untuk melihat preview</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Nanti Saja
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedTemplateId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6B21FF] to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Membuat Sertifikat...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Generate Sertifikat
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
