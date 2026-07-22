export default function PublicFeedbackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div id="google_translate_element" className="absolute top-2 right-2 z-50 print-hide-dialog" />
      <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" />
      <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
        function googleTranslateElementInit() {
          new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'hi,gu,mr,en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
        }
      ` }} />
      {children}
    </>
  )
}
