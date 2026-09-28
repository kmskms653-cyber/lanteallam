// middleware/auth.js - منع قاطع وحماية شاملة

function strictAuthAndSubscription(req, res, next) {
    const path = req.path;

    // 1. حماية لوحة التحكم (Admin): منع قاطع لأي شخص ما لم يكن المشرف (Admin)
    if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
        if (!req.user || req.user.role !== 'admin') {
            if (path.startsWith('/api/')) {
                return res.status(403).json({
                    error: "FORBIDDEN",
                    message: "غير مسموح لك نهائياً بالوصول لوحة الإدارة"
                });
            }
            // إعادة توجيه فورية لمنع رؤية الرابط أو الصفحة
            return res.redirect('/login?error=admin_required');
        }
    }

    // 2. استثناء الصفحات العامة المسموحة للزوار (تسجيل الدخول، الاشتراكات، الصفحة الرئيسية التعريفية)
    const publicPaths = ['/login', '/register', '/subscription', '/api/login', '/api/register'];
    if (publicPaths.includes(path) || path === '/') {
        return next();
    }

    // 3. منع قاطع للزوار (غير المسجلين أو غير المشتركين) من النقر على أي أيقونة أو محتوى تعليمي
    if (!req.user) {
        if (path.startsWith('/api/')) {
            return res.status(401).json({
                error: "LOGIN_REQUIRED",
                message: "يجب تسجيل الدخول أولاً للاستفادة من المحتوى"
            });
        }
        // تحويل الزائر مباشرة لصفحة تسجيل الدخول أو الاشتراك
        return res.redirect('/login?redirect=' + encodeURIComponent(path));
    }

    // 4. التحقق من الاشتراك النشط للمحتويات والأيقونات المدفوعة (active أو trialing فقط)
    const validStatuses = ['active', 'trialing'];
    if (req.user.role !== 'admin' && !validStatuses.includes(req.user.subscriptionStatus)) {
        if (path.startsWith('/api/')) {
            return res.status(402).json({
                error: "SUBSCRIPTION_REQUIRED",
                message: "هذا المحتوى يتطلب اشتراكاً نشطاً. يرجى الترقية للاستفادة من الأيقونات والدروس."
            });
        }
        // تحويل المستخدم غير المشترك مباشرة لصفحة الاشتراكات
        return res.redirect('/subscription?message=upgrade_required');
    }

    next();
}

module.exports = { strictAuthAndSubscription };
// middleware.js - حماية قاطعة وتأكيد حجب إعدادات المشرف عن الجميع عدا المشرف

export function strictAdminProtection(req, res, next) {
    // استخراج مسار الطلب ودور المستخدم (الذي يتم التحقق منه عبر التوكن أو الجلسة الآمنة)
    const pathname = req.nextUrl ? req.nextUrl.pathname : req.path;
    const user = req.user; // بيانات المستخدم الحالي

    // التحقق مما إذا كان الطلب يستهدف لوحة الإدارة أو أيقونات إعدادات المشرف
    const isAdminRoute = pathname.startsWith('/admin') || 
                           pathname.startsWith('/api/admin') || 
                           pathname.includes('/admin-settings');

    if (isAdminRoute) {
        // حجب تام: إذا لم يكن المستخدم موجوداً، أو لم يكن دوره 'admin' حصرياً
        if (!user || user.role !== 'admin') {
            
            // إذا كان الطلب عبر الـ API، يتم إرجاع خطأ أمني صارم
            if (pathname.startsWith('/api/')) {
                return res.status(403).json({
                    error: "ACCESS_DENIED",
                    message: "وصول مرفوض: هذه المنطقة مخصصة للمشرف فقط ولا يمكن لأي دور آخر رؤيتها أو الوصول إليها."
                });
            }

            // إذا كان الطلب عبر المتصفح، يتم إعادة التوجيه القسري بعيداً عن الرابط فوراً
            // يمكن توجيهه إلى الصفحة الرئيسية أو صفحة تسجيل الدخول مع رسالة خطأ
            if (res.redirect) {
                return res.redirect('/login?error=admin_unauthorized');
            }
            return { authorized: false, redirect: '/login' };
        }
    }

    // إذا كان المشرف الحقيقي، يُسمح له بالمرور
    return { authorized: true };
}

}
