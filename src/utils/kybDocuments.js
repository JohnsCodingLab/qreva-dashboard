// Shared by the review queue's thumbnails and the document viewer, so both
// agree on what a document is called and how it can be displayed.

const LABELS = {
  certificateOfIncorporation: 'Certificate of incorporation',
  memorandumOfAssociation: 'Memorandum of association',
  proofOfAddress: 'Proof of address',
  directorIdentification: 'Director identification',
};

// "certificateOfIncorporation" was being shown to reviewers as
// "certificate of incorporation" by regex. Real labels read better and let a
// field be renamed without changing how it displays.
export const documentLabel = (key) =>
  LABELS[key] || String(key).replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

export const isImageDocument = (url) => /\.(png|jpe?g|webp|gif)(\?|$)/i.test(url || '');

export const isPdfDocument = (url) => /\.pdf(\?|$)/i.test(url || '');
