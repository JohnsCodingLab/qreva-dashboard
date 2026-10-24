import React, { useEffect, useState } from 'react';
import BaseModal from './BaseModal';
import { documentLabel, isImageDocument, isPdfDocument } from '@/utils/kybDocuments';

/**
 * Views a partner's KYB documents without leaving the queue.
 *
 * They were plain links: reviewing one business meant opening four tabs,
 * losing the row you were on, and coming back to decide from memory. Approving
 * or rejecting a business is a decision made while looking at the documents,
 * so the documents belong next to the buttons.
 */
const KybDocumentModal = ({ isOpen, onClose, documents = [], startIndex = 0, partnerName }) => {
  const [index, setIndex] = useState(startIndex);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex, isOpen]);

  // Reset per document, otherwise one broken file marks every later one broken.
  useEffect(() => {
    setImageFailed(false);
  }, [index]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, documents.length - 1));
      if (event.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, documents.length]);

  if (!isOpen || documents.length === 0) return null;

  const current = documents[Math.min(index, documents.length - 1)];
  const [name, url] = current;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={documentLabel(name)} maxWidth="max-w-4xl">
      <p className="-mt-2 mb-3 text-xs text-gray-500">
        {partnerName}
        {documents.length > 1 && ` · ${index + 1} of ${documents.length}`}
      </p>

      <div className="flex min-h-[60vh] items-center justify-center rounded-lg border bg-gray-50">
        {isImageDocument(url) && !imageFailed && (
          <img
            src={url}
            alt={documentLabel(name)}
            className="max-h-[70vh] w-auto object-contain"
            onError={() => setImageFailed(true)}
          />
        )}

        {isPdfDocument(url) && (
          // An object rather than an img: PDFs render in the browser's own
          // viewer. If the file cannot be fetched the fallback inside is shown
          // instead of an empty grey box.
          <object data={url} type="application/pdf" className="h-[70vh] w-full">
            <Unavailable url={url} />
          </object>
        )}

        {((isImageDocument(url) && imageFailed) || (!isImageDocument(url) && !isPdfDocument(url))) && (
          <Unavailable url={url} />
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-primary underline"
        >
          Open in a new tab
        </a>

        {documents.length > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              disabled={index === 0}
              className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(i + 1, documents.length - 1))}
              disabled={index >= documents.length - 1}
              className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

// Says what to do next rather than only that something is wrong. PDFs in
// particular can fail to display for reasons the reviewer cannot fix from here.
const Unavailable = ({ url }) => (
  <div className="px-6 py-12 text-center">
    <p className="text-sm font-medium text-[#1E1E1E]">This document could not be displayed here</p>
    <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">
      The file may not be readable by the browser, or the storage account may not allow it to be shown
      inline.
    </p>
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-block rounded-md border px-3 py-1.5 text-xs underline"
    >
      Open in a new tab
    </a>
  </div>
);

export default KybDocumentModal;
