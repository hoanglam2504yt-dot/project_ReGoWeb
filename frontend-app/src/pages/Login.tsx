import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import bgImage from "../assets/images/background/background.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaCode, setCaptchaCode] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateCaptcha = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        let newCode = "";
        for (let i = 0; i < 4; i++) {
            newCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(newCode);
        drawCaptchaOnCanvas(newCode);
    };

    const drawCaptchaOnCanvas = (code: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add some noise lines
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.strokeStyle = "#9ca3af";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Text
        ctx.font = "bold 24px Inter, sans-serif";
        ctx.fillStyle = "#4b5563";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(code, canvas.width / 2, canvas.height / 2);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (captchaInput.toLowerCase() !== captchaCode.toLowerCase()) {
            setError("Mã xác nhận không chính xác.");
            generateCaptcha();
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Không thể kết nối đến máy chủ.";
            setError(msg);
            generateCaptcha();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-gray-900 bg-gray-50 font-sans">
            {/* Left side: branding/background image */}
            <div
                className="hidden lg:flex w-[450px] h-[500px] shrink-0 flex-col justify-end items-center pb-16"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
            </div>

            {/* Right side: form */}
            <div className="flex-1 flex justify-center items-center p-6 bg-white shrink">
                <div className="w-full max-w-[440px]">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
                        <p className="text-gray-600 text-sm">
                            Chưa có tài khoản?{" "}
                            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-3 mb-6">
                        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#f3f4f6] hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#f3f4f6] hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs text-center uppercase tracking-wider">
                            <span className="bg-white px-2 text-gray-400 font-medium tracking-tight">Hoặc tiếp tục với email</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-5 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                Địa chỉ Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-sm"
                                placeholder="user@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-1.5">
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    Mật khẩu
                                </label>
                                <a href="#" className="text-xs text-indigo-600 hover:underline font-medium">Quên mật khẩu?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-sm pr-10"
                                    placeholder="••••••••••••"
                                />
                                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                                    <svg className="w-4 h-4 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                Mã xác nhận
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={captchaInput}
                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-sm"
                                    placeholder="Nhập 4 ký tự"
                                    autoComplete="off"
                                />
                                <div className="shrink-0 cursor-pointer" onClick={generateCaptcha} title="Đổi mã khác">
                                    <canvas ref={canvasRef} width="100" height="42" className="rounded-lg border border-gray-200"></canvas>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed font-[Inter]"
                        >
                            {loading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;