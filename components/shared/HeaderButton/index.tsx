const HeaderButton = ({ title, setActiveTab, active, disabled }: { title: string, setActiveTab: (tab: string) => void, active: boolean, disabled: boolean }) => (
    <button
      className={`nav-button ${active ? 'active' : ''}`}
      onClick={() => setActiveTab(title)}
      disabled={disabled}
    >
      {title}
    </button>
  );

  export default HeaderButton;
