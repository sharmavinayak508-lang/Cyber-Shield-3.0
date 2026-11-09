// Sirf admin / super_admin ko permission
window.CyberCanViewOthersLocation = function(userDoc){
  if(!userDoc) return false;
  var role = String(userDoc.role || '').toLowerCase().trim();
  if(role === 'admin' || role === 'super_admin') return true;
  if(window.isSuperAdminEmail && userDoc.email && window.isSuperAdminEmail(userDoc.email)) return true;
  return false;
};

// Admin ko bhi sirf City, State — lat/lng + phone JAAN-BUJH KE nahi liya
window.CyberSafeMember = function(doc){
  var d = doc.data ? doc.data() : doc;
  return {
    _id: doc.id || d.uid || '',
    name: d.name || (d.email ? String(d.email).split('@')[0] : 'Member'),
    email: d.email || '',
    role: d.role || 'user',
    city: d.city || '',
    state: d.state || '',
    blocked: !!d.blocked
  };
};
