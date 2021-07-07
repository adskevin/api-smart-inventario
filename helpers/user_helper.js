exports.verifyFields = (body) => {
  if(!body.name) return false;
  if(!body.password) return false;
  if(!body.email) return false;
  return true;
}