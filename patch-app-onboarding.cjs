const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

content = content.replace(
  `<ProfileSwitcher
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          activeProfile={activeProfile}
          onProfileChanged={handleProfileCreatedOrUpdated}
        />`,
  `<ProfileSwitcher
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          activeProfile={activeProfile}
          onProfileChanged={handleProfileCreatedOrUpdated}
          onOpenFullOnboarding={() => setIsOnboardingModalOpen(true)}
        />`
);

fs.writeFileSync(appPath, content, 'utf8');
console.log('Successfully wired onOpenFullOnboarding in App.tsx');
