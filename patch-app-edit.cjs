const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

content = content.replace(
  `<OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => {
          if (activeProfile) setIsOnboardingModalOpen(false);
        }}
        onProfileCreated={handleProfileCreatedOrUpdated}
        isInitialSetup={!activeProfile}
      />`,
  `<OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => {
          if (activeProfile) setIsOnboardingModalOpen(false);
        }}
        onProfileCreated={handleProfileCreatedOrUpdated}
        initialProfile={activeProfile}
      />`
);

fs.writeFileSync(appPath, content, 'utf8');
console.log('Successfully updated OnboardingModal invocation in App.tsx');
