import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useCallback } from 'react';

export default function UploadZone({ onFilesAccepted, isProcessing }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      onFilesAccepted(acceptedFiles);
    }
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    maxFiles: 100,
    disabled: isProcessing
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative w-full p-12 mt-8 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer group flex flex-col items-center justify-center min-h-[300px]
      ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 hover:dark:bg-gray-800 hover:border-primary-400'}
      ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
      ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      backdrop-blur-sm shadow-sm`}
    >
      <input {...getInputProps()} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-transparent dark:from-primary-900/10 pointer-events-none rounded-2xl" />
      
      <div className={`p-5 rounded-full mb-6 transition-transform duration-300 ${isDragActive ? 'scale-110 bg-primary-100 dark:bg-primary-900/50 text-primary-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 group-hover:text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/50'}`}>
        <UploadCloud size={48} strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 text-center">
        {isDragActive ? 'Drop images here...' : 'Drag & drop images'}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        Supports JPG, JPEG, and PNG. Select up to 100 images at once for AI analysis.
      </p>

      <button className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg text-sm transition-all hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white hover:shadow-lg hover:-translate-y-0.5 pointer-events-none active:scale-95">
        Browse Files
      </button>
      
      {/* Decorative floating icons */}
      <ImageIcon size={24} className={`absolute top-10 left-10 text-gray-300 dark:text-gray-600 transition-all duration-700 ${isDragActive ? 'translate-y-4 opacity-0' : 'opacity-50'}`} />
      <ImageIcon size={20} className={`absolute bottom-12 right-16 text-primary-200 dark:text-primary-900 transition-all duration-700 ${isDragActive ? '-translate-y-4 opacity-0' : 'opacity-50'}`} />
    </div>
  );
}
