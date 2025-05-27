import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, AlertCircle } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { classNames } from '~/utils/classNames';

interface PDFDebugViewProps {
  fileName: string;
  fullContent: string;
  processedContent: string;
  formFieldsCount?: number;
}

export const PDFDebugView: React.FC<PDFDebugViewProps> = ({
  fileName,
  fullContent,
  processedContent,
  formFieldsCount = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  // Calculate content statistics
  const fullContentStats = {
    characters: fullContent.length,
    words: fullContent.split(/\s+/).filter(Boolean).length,
    lines: fullContent.split('\n').length,
  };

  const processedContentStats = {
    characters: processedContent.length,
    words: processedContent.split(/\s+/).filter(Boolean).length,
    lines: processedContent.split('\n').length,
  };

  const compressionRatio = ((1 - processedContent.length / fullContent.length) * 100).toFixed(1);

  return (
    <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">PDF Debug View</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{fileName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              {formFieldsCount > 0 && <span className="text-green-600 font-medium">{formFieldsCount} form fields</span>}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {compressionRatio}% compressed
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Statistics */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Original Size</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {fullContentStats.characters.toLocaleString()} chars
              </p>
              <p className="text-xs text-gray-500">{fullContentStats.words.toLocaleString()} words</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Processed Size</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {processedContentStats.characters.toLocaleString()} chars
              </p>
              <p className="text-xs text-gray-500">{processedContentStats.words.toLocaleString()} words</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Compression</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{compressionRatio}%</p>
              <p className="text-xs text-gray-500">reduced</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Lines</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {processedContentStats.lines.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">in output</p>
            </div>
          </div>

          {/* Content Toggle */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Button
                variant={!showFullContent ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowFullContent(false)}
              >
                Processed Content
              </Button>
              <Button
                variant={showFullContent ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowFullContent(true)}
              >
                Full Content
              </Button>
              {showFullContent && (
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Showing full extracted content (may be large)</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Display */}
          <div className="p-4 max-h-96 overflow-y-auto">
            <pre className={classNames(
              "text-xs font-mono whitespace-pre-wrap break-words",
              "bg-white dark:bg-gray-950 p-4 rounded border",
              "border-gray-200 dark:border-gray-700",
              showFullContent ? "text-gray-600 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"
            )}>
              {showFullContent ? fullContent : processedContent}
            </pre>
          </div>

          {/* Copy Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(showFullContent ? fullContent : processedContent);
              }}
            >
              Copy {showFullContent ? 'Full' : 'Processed'} Content
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};