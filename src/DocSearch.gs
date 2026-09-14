/**
 * Searches the customer documents Drive folder for a file matching
 * a free-text query (customer name, plate number, doc type, etc).
 * Recurses one level into subfolders (e.g. per-customer folders).
 */
function findDocuments_(query) {
  const cfg = getConfig_();
  if (!cfg.docsFolderId) return [];

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = [];

  function scan(folder) {
    const files = folder.getFiles();
    while (files.hasNext()) {
      const f = files.next();
      const name = f.getName().toLowerCase();
      if (terms.every(function (t) { return name.indexOf(t) !== -1; })) {
        matches.push(f);
      }
    }
    const subfolders = folder.getFolders();
    while (subfolders.hasNext()) {
      scan(subfolders.next());
    }
  }

  scan(DriveApp.getFolderById(cfg.docsFolderId));
  return matches;
}
