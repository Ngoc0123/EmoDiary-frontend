// Translation types and content for the application

export type Language = 'vi' | 'en';

export interface Translations {
  // Common
  common: {
    backToHome: string;
    or: string;
    loading: string;
  };
  
  // Navigation
  nav: {
    signIn: string;
    signUp: string;
    logout: string;
    account: string;
    changeLanguage: string;
    mute: string;
    unmute: string;
  };
  
  // Homepage
  home: {
    attendance: string;
    library: string;
    emotionHistory: string;
  };
  
  // Sign In Page
  signIn: {
    title: string;
    subtitle: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    submit: string;
    noAccount: string;
    signUpLink: string;
    errorRequired: string;
    errorFailed: string;
  };
  
  // Sign Up Page
  signUp: {
    title: string;
    subtitle: string;
    username: string;
    usernamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    submit: string;
    hasAccount: string;
    signInLink: string;
    terms: string;
    termsLink: string;
    and: string;
    privacyLink: string;
    // Password validation
    minLength: string;
    hasUppercase: string;
    hasNumber: string;
    passwordsMatch: string;
    // Errors
    errorRequired: string;
    errorPasswordMismatch: string;
    errorMinLength: string;
    errorFailed: string;
  };
  
  // Attendance Page
  attendance: {
    title: string;
    subtitle: string;
    drawYourFeeling: string;
    clear: string;
    undo: string;
    redo: string;
    save: string;
    saving: string;
    saved: string;
    stop: string;
    brush: string;
    eraser: string;
    picker: string;
    layers: string;
    share: string;
    download: string;
    brushSize: string;
    colors: string;
    backToHome: string;
    errorSave: string;
    opacity: string;
    fill: string;
    zoom: string;
  };
}

export const translations: Record<Language, Translations> = {
  vi: {
    common: {
      backToHome: "← Quay về trang chủ",
      or: "hoặc",
      loading: "Đang tải...",
    },
    nav: {
      signIn: "Đăng nhập",
      signUp: "Đăng ký",
      logout: "Đăng xuất",
      account: "Tài khoản",
      changeLanguage: "Đổi ngôn ngữ",
      mute: "Tắt tiếng",
      unmute: "Bật tiếng",
    },
    home: {
      attendance: "Điểm Danh",
      library: "Thư viện",
      emotionHistory: "Lịch sử cảm xúc",
    },
    signIn: {
      title: "Chào mừng trở lại!",
      subtitle: "Đăng nhập để tiếp tục hành trình của bạn",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Mật khẩu",
      passwordPlaceholder: "••••••••",
      forgotPassword: "Quên mật khẩu?",
      submit: "Đăng nhập",
      noAccount: "Chưa có tài khoản?",
      signUpLink: "Đăng ký ngay",
      errorRequired: "Vui lòng điền đầy đủ thông tin",
      errorFailed: "Đăng nhập thất bại. Vui lòng thử lại.",
    },
    signUp: {
      title: "Tạo tài khoản mới",
      subtitle: "Bắt đầu hành trình khám phá cảm xúc của bạn",
      username: "Tên người dùng",
      usernamePlaceholder: "Nhập tên của bạn",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Mật khẩu",
      passwordPlaceholder: "••••••••",
      confirmPassword: "Xác nhận mật khẩu",
      confirmPasswordPlaceholder: "••••••••",
      submit: "Tạo tài khoản",
      hasAccount: "Đã có tài khoản?",
      signInLink: "Đăng nhập",
      terms: "Bằng cách đăng ký, bạn đồng ý với",
      termsLink: "Điều khoản sử dụng",
      and: "và",
      privacyLink: "Chính sách bảo mật",
      minLength: "Ít nhất 8 ký tự",
      hasUppercase: "Có chữ in hoa",
      hasNumber: "Có số",
      passwordsMatch: "Mật khẩu khớp",
      errorRequired: "Vui lòng điền đầy đủ thông tin",
      errorPasswordMismatch: "Mật khẩu xác nhận không khớp",
      errorMinLength: "Mật khẩu phải có ít nhất 8 ký tự",
      errorFailed: "Đăng ký thất bại. Vui lòng thử lại.",
    },
    attendance: {
      title: "Điểm Danh",
      subtitle: "Vẽ bất cứ điều gì bạn muốn!",
      drawYourFeeling: "Vẽ ngày của bạn",
      clear: "Xóa tất cả",
      undo: "Hoàn tác",
      redo: "Làm lại",
      save: "Lưu",
      saving: "Đang lưu...",
      saved: "Đã lưu!",
      stop: "Dừng",
      brush: "Bút vẽ",
      eraser: "Tẩy",
      picker: "Hút màu",
      layers: "Các lớp",
      share: "Chia sẻ",
      download: "Tải xuống",
      brushSize: "Kích thước bút",
      colors: "Màu sắc",
      backToHome: "← Quay về trang chủ",
      errorSave: "Lỗi lưu. Thử lại!",
      opacity: "Độ đậm nhạt",
      fill: "Đổ màu",
      zoom: "Thu phóng",
    },
  },
  en: {
    common: {
      backToHome: "← Back to home",
      or: "or",
      loading: "Loading...",
    },
    nav: {
      signIn: "Sign In",
      signUp: "Sign Up",
      logout: "Log out",
      account: "Account",
      changeLanguage: "Change language",
      mute: "Mute",
      unmute: "Unmute",
    },
    home: {
      attendance: "Attendance",
      library: "Library",
      emotionHistory: "Emotion History",
    },
    signIn: {
      title: "Welcome back!",
      subtitle: "Sign in to continue your journey",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      forgotPassword: "Forgot password?",
      submit: "Sign In",
      noAccount: "Don't have an account?",
      signUpLink: "Sign up now",
      errorRequired: "Please fill in all fields",
      errorFailed: "Sign in failed. Please try again.",
    },
    signUp: {
      title: "Create new account",
      subtitle: "Start your journey of exploring emotions",
      username: "Username",
      usernamePlaceholder: "Enter your name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder: "••••••••",
      submit: "Create account",
      hasAccount: "Already have an account?",
      signInLink: "Sign in",
      terms: "By signing up, you agree to our",
      termsLink: "Terms of Service",
      and: "and",
      privacyLink: "Privacy Policy",
      minLength: "At least 8 characters",
      hasUppercase: "Has uppercase letter",
      hasNumber: "Has number",
      passwordsMatch: "Passwords match",
      errorRequired: "Please fill in all fields",
      errorPasswordMismatch: "Passwords do not match",
      errorMinLength: "Password must be at least 8 characters",
      errorFailed: "Sign up failed. Please try again.",
    },
    attendance: {
      title: "Attendance",
      subtitle: "Draw whatever you want!",
      drawYourFeeling: "Draw your day",
      clear: "Clear All",
      undo: "Undo",
      redo: "Redo",
      save: "Save",
      saving: "Saving...",
      saved: "Saved!",
      stop: "Stop",
      brush: "Brush",
      eraser: "Eraser",
      picker: "Color Picker",
      layers: "Layers",
      share: "Share",
      download: "Download",
      brushSize: "Brush Size",
      colors: "Colors",
      backToHome: "← Back to home",
      errorSave: "Save failed. Retry!",
      opacity: "Opacity",
      fill: "Fill",
      zoom: "Zoom",
    },
  },
};
