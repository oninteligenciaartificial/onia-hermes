'use strict';
// Creative upload request builders (pure/DRY), so the mapping can later reference
// a real video_id / image_hash. Video via a hosted file_url (e.g. the ONIA asset
// server); image via base64 bytes. These build the request only — the client
// decides whether to actually send it (DRY by default).

/**
 * @param {{ adAccountId: string, fileUrl: string, name?: string, apiVersion?: string }} spec
 */
function buildVideoUploadRequest(spec) {
  if (!spec.adAccountId) throw new Error('buildVideoUploadRequest: adAccountId required');
  if (!spec.fileUrl) throw new Error('buildVideoUploadRequest: fileUrl required');
  const body = { file_url: spec.fileUrl };
  if (spec.name) body.name = spec.name;
  const version = spec.apiVersion || 'v21.0';
  return { method: 'POST', url: `https://graph.facebook.com/${version}/${spec.adAccountId}/advideos`, body };
}

/**
 * @param {{ adAccountId: string, bytesBase64: string, name?: string, apiVersion?: string }} spec
 */
function buildImageUploadRequest(spec) {
  if (!spec.adAccountId) throw new Error('buildImageUploadRequest: adAccountId required');
  if (!spec.bytesBase64) throw new Error('buildImageUploadRequest: bytesBase64 required');
  const body = { bytes: spec.bytesBase64 };
  if (spec.name) body.name = spec.name;
  const version = spec.apiVersion || 'v21.0';
  return { method: 'POST', url: `https://graph.facebook.com/${version}/${spec.adAccountId}/adimages`, body };
}

module.exports = { buildVideoUploadRequest, buildImageUploadRequest };
