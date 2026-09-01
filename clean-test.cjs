const { createClient } = require('@supabase/supabase-js');

const url = 'https://erxokhhjrbwxxvxmhrqc.supabase.co';
const key = 'sb_publishable_CIywJk0ES3t3N4K2ssY1Lg_3fKCqVBR';
const supabase = createClient(url, key);

(async () => {
  console.log('Cleaning up test data from Supabase...');
  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', 'vasir');

  if (error) {
    console.error('Delete error:', error.message);
  } else {
    console.log('Cleaned up test profile vasir from Supabase.');
  }
})();
