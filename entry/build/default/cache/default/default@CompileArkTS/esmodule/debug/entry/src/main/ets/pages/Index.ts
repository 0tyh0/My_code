if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    pageIndex?: number;
    dbReady?: boolean;
    busy?: boolean;
    totalCount?: number;
    message?: string;
    messageOk?: boolean;
    hintOpen?: boolean;
    account?: string;
    password?: string;
    username?: string;
    regPassword?: string;
    confirmPassword?: string;
    phone?: string;
    email?: string;
    loggedUserId?: number;
    loggedUsername?: string;
    loggedTel?: string;
    loggedEmail?: string;
}
import { UserDatabase } from "@normalized:N&&&entry/src/main/ets/database/UserDatabase&";
import type { AuthResult } from '../model/User';
// 统一视觉规范，避免同一页面出现多种相近色
const PRIMARY: string = '#2F6BFF';
const ACCENT: string = '#0C8F7C';
const ACCENT_TEXT: string = '#0A7F6E';
const DANGER: string = '#C43F32';
const TEXT_MAIN: string = '#16233A';
const TEXT_SUB: string = '#5F6E86';
const TEXT_HINT: string = '#8E9CAF';
const FIELD_BG: string = '#F3F6FB';
const LINE: string = '#EEF2F8';
function __TextInput__fieldInput(): void {
    TextInput.layoutWeight(1);
    TextInput.height(52);
    TextInput.margin({ left: 10 });
    TextInput.padding(0);
    TextInput.fontSize(16);
    TextInput.fontColor(TEXT_MAIN);
    TextInput.backgroundColor(Color.Transparent);
    TextInput.borderRadius(0);
    TextInput.placeholderColor(TEXT_HINT);
    TextInput.placeholderFont({ size: 15 });
    TextInput.caretColor(PRIMARY);
    TextInput.showUnderline(false);
}
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__pageIndex = new ObservedPropertySimplePU(0, this, "pageIndex");
        this.__dbReady = new ObservedPropertySimplePU(false, this, "dbReady");
        this.__busy = new ObservedPropertySimplePU(false, this, "busy");
        this.__totalCount = new ObservedPropertySimplePU(0, this, "totalCount");
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.__messageOk = new ObservedPropertySimplePU(false, this, "messageOk");
        this.__hintOpen = new ObservedPropertySimplePU(false, this, "hintOpen");
        this.__account = new ObservedPropertySimplePU('', this, "account");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__regPassword = new ObservedPropertySimplePU('', this, "regPassword");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__phone = new ObservedPropertySimplePU('', this, "phone");
        this.__email = new ObservedPropertySimplePU('', this, "email");
        this.__loggedUserId = new ObservedPropertySimplePU(0, this, "loggedUserId");
        this.__loggedUsername = new ObservedPropertySimplePU('', this, "loggedUsername");
        this.__loggedTel = new ObservedPropertySimplePU('', this, "loggedTel");
        this.__loggedEmail = new ObservedPropertySimplePU('', this, "loggedEmail");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.pageIndex !== undefined) {
            this.pageIndex = params.pageIndex;
        }
        if (params.dbReady !== undefined) {
            this.dbReady = params.dbReady;
        }
        if (params.busy !== undefined) {
            this.busy = params.busy;
        }
        if (params.totalCount !== undefined) {
            this.totalCount = params.totalCount;
        }
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.messageOk !== undefined) {
            this.messageOk = params.messageOk;
        }
        if (params.hintOpen !== undefined) {
            this.hintOpen = params.hintOpen;
        }
        if (params.account !== undefined) {
            this.account = params.account;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.regPassword !== undefined) {
            this.regPassword = params.regPassword;
        }
        if (params.confirmPassword !== undefined) {
            this.confirmPassword = params.confirmPassword;
        }
        if (params.phone !== undefined) {
            this.phone = params.phone;
        }
        if (params.email !== undefined) {
            this.email = params.email;
        }
        if (params.loggedUserId !== undefined) {
            this.loggedUserId = params.loggedUserId;
        }
        if (params.loggedUsername !== undefined) {
            this.loggedUsername = params.loggedUsername;
        }
        if (params.loggedTel !== undefined) {
            this.loggedTel = params.loggedTel;
        }
        if (params.loggedEmail !== undefined) {
            this.loggedEmail = params.loggedEmail;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__pageIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__dbReady.purgeDependencyOnElmtId(rmElmtId);
        this.__busy.purgeDependencyOnElmtId(rmElmtId);
        this.__totalCount.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__messageOk.purgeDependencyOnElmtId(rmElmtId);
        this.__hintOpen.purgeDependencyOnElmtId(rmElmtId);
        this.__account.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__regPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
        this.__email.purgeDependencyOnElmtId(rmElmtId);
        this.__loggedUserId.purgeDependencyOnElmtId(rmElmtId);
        this.__loggedUsername.purgeDependencyOnElmtId(rmElmtId);
        this.__loggedTel.purgeDependencyOnElmtId(rmElmtId);
        this.__loggedEmail.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__pageIndex.aboutToBeDeleted();
        this.__dbReady.aboutToBeDeleted();
        this.__busy.aboutToBeDeleted();
        this.__totalCount.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        this.__messageOk.aboutToBeDeleted();
        this.__hintOpen.aboutToBeDeleted();
        this.__account.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__username.aboutToBeDeleted();
        this.__regPassword.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__phone.aboutToBeDeleted();
        this.__email.aboutToBeDeleted();
        this.__loggedUserId.aboutToBeDeleted();
        this.__loggedUsername.aboutToBeDeleted();
        this.__loggedTel.aboutToBeDeleted();
        this.__loggedEmail.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __pageIndex: ObservedPropertySimplePU<number>;
    get pageIndex() {
        return this.__pageIndex.get();
    }
    set pageIndex(newValue: number) {
        this.__pageIndex.set(newValue);
    }
    private __dbReady: ObservedPropertySimplePU<boolean>;
    get dbReady() {
        return this.__dbReady.get();
    }
    set dbReady(newValue: boolean) {
        this.__dbReady.set(newValue);
    }
    private __busy: ObservedPropertySimplePU<boolean>;
    get busy() {
        return this.__busy.get();
    }
    set busy(newValue: boolean) {
        this.__busy.set(newValue);
    }
    private __totalCount: ObservedPropertySimplePU<number>;
    get totalCount() {
        return this.__totalCount.get();
    }
    set totalCount(newValue: number) {
        this.__totalCount.set(newValue);
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    private __messageOk: ObservedPropertySimplePU<boolean>;
    get messageOk() {
        return this.__messageOk.get();
    }
    set messageOk(newValue: boolean) {
        this.__messageOk.set(newValue);
    }
    private __hintOpen: ObservedPropertySimplePU<boolean>;
    get hintOpen() {
        return this.__hintOpen.get();
    }
    set hintOpen(newValue: boolean) {
        this.__hintOpen.set(newValue);
    }
    private __account: ObservedPropertySimplePU<string>;
    get account() {
        return this.__account.get();
    }
    set account(newValue: string) {
        this.__account.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __regPassword: ObservedPropertySimplePU<string>;
    get regPassword() {
        return this.__regPassword.get();
    }
    set regPassword(newValue: string) {
        this.__regPassword.set(newValue);
    }
    private __confirmPassword: ObservedPropertySimplePU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(newValue: string) {
        this.__confirmPassword.set(newValue);
    }
    private __phone: ObservedPropertySimplePU<string>;
    get phone() {
        return this.__phone.get();
    }
    set phone(newValue: string) {
        this.__phone.set(newValue);
    }
    private __email: ObservedPropertySimplePU<string>;
    get email() {
        return this.__email.get();
    }
    set email(newValue: string) {
        this.__email.set(newValue);
    }
    private __loggedUserId: ObservedPropertySimplePU<number>;
    get loggedUserId() {
        return this.__loggedUserId.get();
    }
    set loggedUserId(newValue: number) {
        this.__loggedUserId.set(newValue);
    }
    private __loggedUsername: ObservedPropertySimplePU<string>;
    get loggedUsername() {
        return this.__loggedUsername.get();
    }
    set loggedUsername(newValue: string) {
        this.__loggedUsername.set(newValue);
    }
    private __loggedTel: ObservedPropertySimplePU<string>;
    get loggedTel() {
        return this.__loggedTel.get();
    }
    set loggedTel(newValue: string) {
        this.__loggedTel.set(newValue);
    }
    private __loggedEmail: ObservedPropertySimplePU<string>;
    get loggedEmail() {
        return this.__loggedEmail.get();
    }
    set loggedEmail(newValue: string) {
        this.__loggedEmail.set(newValue);
    }
    aboutToAppear(): void {
        this.initDatabase();
    }
    private async initDatabase(): Promise<void> {
        const hostContext = this.getUIContext().getHostContext();
        if (hostContext === undefined) {
            this.setMessage('无法获取应用上下文', false);
            return;
        }
        try {
            await UserDatabase.init(hostContext);
            this.totalCount = await UserDatabase.getUserCount();
            this.dbReady = true;
        }
        catch (err) {
            const reason: string = `${err}`;
            this.setMessage(`数据库初始化失败：${reason}`, false);
        }
    }
    private setMessage(text: string, ok: boolean): void {
        this.message = text;
        this.messageOk = ok;
    }
    private switchPage(index: number): void {
        this.message = '';
        this.pageIndex = index;
        if (index === 0) {
            this.password = '';
            this.regPassword = '';
            this.confirmPassword = '';
        }
    }
    private async doLogin(): Promise<void> {
        if (!this.dbReady || this.busy) {
            return;
        }
        const accountValue: string = this.account.trim();
        const passwordValue: string = this.password;
        if (accountValue.length === 0) {
            this.setMessage('请输入用户编号、姓名、电话或邮箱', false);
            return;
        }
        if (passwordValue.length === 0) {
            this.setMessage('请输入密码', false);
            return;
        }
        this.busy = true;
        this.message = '';
        try {
            const result: AuthResult = await UserDatabase.login(accountValue, passwordValue);
            if (result.success && result.user !== null) {
                this.loggedUserId = result.user.userId;
                this.loggedUsername = result.user.username;
                this.loggedTel = result.user.utel;
                this.loggedEmail = result.user.uemail;
                this.account = '';
                this.password = '';
                this.switchPage(2);
            }
            else {
                this.setMessage(result.message, false);
            }
        }
        catch (err) {
            const reason: string = `${err}`;
            this.setMessage(`登录失败：${reason}`, false);
        }
        finally {
            this.busy = false;
        }
    }
    private validateRegister(): string {
        const nameValue: string = this.username.trim();
        const passwordValue: string = this.regPassword;
        const telValue: string = this.phone.trim();
        const emailValue: string = this.email.trim();
        if (nameValue.length < 2 || nameValue.length > 20) {
            return '姓名长度需为 2 至 20 个字符';
        }
        const namePattern: RegExp = /^[\u4e00-\u9fa5A-Za-z0-9_]+$/;
        if (!namePattern.test(nameValue)) {
            return '姓名仅支持中文、字母、数字和下划线';
        }
        const telPattern: RegExp = /^1[3-9]\d{9}$/;
        if (!telPattern.test(telValue)) {
            return '请输入正确的 11 位手机号码';
        }
        const emailPattern: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailPattern.test(emailValue)) {
            return '请输入正确的电子邮箱';
        }
        if (passwordValue.length < 6 || passwordValue.length > 20) {
            return '密码长度需为 6 至 20 位';
        }
        if (passwordValue !== this.confirmPassword) {
            return '两次输入的密码不一致';
        }
        return '';
    }
    private async doRegister(): Promise<void> {
        if (!this.dbReady || this.busy) {
            return;
        }
        const invalid: string = this.validateRegister();
        if (invalid.length > 0) {
            this.setMessage(invalid, false);
            return;
        }
        this.busy = true;
        this.message = '';
        try {
            const result: AuthResult = await UserDatabase.register(this.username.trim(), this.regPassword, this.phone.trim(), this.email.trim());
            if (result.success) {
                this.totalCount = await UserDatabase.getUserCount();
                const registeredName: string = this.username.trim();
                this.clearRegisterForm();
                this.account = registeredName;
                this.switchPage(0);
                this.setMessage(`注册成功，用户编号 ${result.newUserId}，请使用该账号登录`, true);
            }
            else {
                this.setMessage(result.message, false);
            }
        }
        catch (err) {
            const reason: string = `${err}`;
            this.setMessage(`注册失败：${reason}`, false);
        }
        finally {
            this.busy = false;
        }
    }
    private clearRegisterForm(): void {
        this.username = '';
        this.regPassword = '';
        this.confirmPassword = '';
        this.phone = '';
        this.email = '';
    }
    private logout(): void {
        this.loggedUserId = 0;
        this.loggedUsername = '';
        this.loggedTel = '';
        this.loggedEmail = '';
        this.switchPage(0);
    }
    fieldChip(label: string, color: string, background: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.width(30);
            Text.height(30);
            Text.fontSize(13);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(color);
            Text.backgroundColor(background);
            Text.borderRadius(9);
            Text.textAlign(TextAlign.Center);
            Text.align(Alignment.Center);
        }, Text);
        Text.pop();
    }
    brandHeader(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.padding({ top: 30, bottom: 26, left: 24, right: 24 });
            Column.linearGradient({
                angle: 145,
                colors: [['#1D4ED8', 0], ['#3B82F6', 0.55], ['#5AC8F5', 1]]
            });
            Column.borderRadius({ bottomLeft: 28, bottomRight: 28 });
            Column.clip(true);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('U');
            Text.width(46);
            Text.height(46);
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
            Text.backgroundColor('#33FFFFFF');
            Text.borderRadius(15);
            Text.textAlign(TextAlign.Center);
            Text.align(Alignment.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户中心');
            Text.fontSize(23);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('登录 · 注册 · SQLite 数据管理');
            Text.fontSize(12);
            Text.fontColor('#DCE9FF');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.padding({ left: 12, right: 12, top: 7, bottom: 7 });
            Row.backgroundColor('#FFFFFF');
            Row.borderRadius(14);
            Row.margin({ top: 16 });
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.dbReady) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width(8);
                        Row.height(8);
                        Row.borderRadius(4);
                        Row.backgroundColor('#12A67D');
                    }, Row);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(14);
                        LoadingProgress.height(14);
                        LoadingProgress.color(PRIMARY);
                    }, LoadingProgress);
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.dbReady ? `SQLite 已就绪 · tb_user ${this.totalCount} 条记录` : '正在初始化数据库…');
            Text.fontSize(12);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#2F5BD6');
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    modeSwitch(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 4 });
            Row.width('92%');
            Row.padding(4);
            Row.backgroundColor('#FFFFFF');
            Row.borderRadius(16);
            Row.margin({ top: 16 });
            Row.shadow({ radius: 18, color: '#0F2F6BFF', offsetX: 0, offsetY: 6 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户登录');
            Text.layoutWeight(1);
            Text.height(42);
            Text.fontSize(15);
            Text.fontWeight(this.pageIndex === 0 ? FontWeight.Medium : FontWeight.Normal);
            Text.fontColor(this.pageIndex === 0 ? '#FFFFFF' : TEXT_SUB);
            Text.textAlign(TextAlign.Center);
            Text.backgroundColor(this.pageIndex === 0 ? PRIMARY : Color.Transparent);
            Text.borderRadius(12);
            Text.onClick(() => {
                this.getUIContext().animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
                    this.switchPage(0);
                });
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('注册账号');
            Text.layoutWeight(1);
            Text.height(42);
            Text.fontSize(15);
            Text.fontWeight(this.pageIndex === 1 ? FontWeight.Medium : FontWeight.Normal);
            Text.fontColor(this.pageIndex === 1 ? '#FFFFFF' : TEXT_SUB);
            Text.textAlign(TextAlign.Center);
            Text.backgroundColor(this.pageIndex === 1 ? ACCENT : Color.Transparent);
            Text.borderRadius(12);
            Text.onClick(() => {
                this.getUIContext().animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
                    this.switchPage(1);
                });
            });
        }, Text);
        Text.pop();
        Row.pop();
    }
    messageTip(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.message.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.width('100%');
                        Row.padding({ left: 12, right: 12, top: 10, bottom: 10 });
                        Row.backgroundColor(this.messageOk ? '#E7F7F1' : '#FDECEC');
                        Row.borderRadius(12);
                        Row.alignItems(VerticalAlign.Center);
                        Row.margin({ top: 14 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.messageOk ? '✓' : '!');
                        Text.width(18);
                        Text.height(18);
                        Text.fontSize(12);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#FFFFFF');
                        Text.backgroundColor(this.messageOk ? ACCENT_TEXT : '#E5484D');
                        Text.borderRadius(9);
                        Text.textAlign(TextAlign.Center);
                        Text.align(Alignment.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.message);
                        Text.layoutWeight(1);
                        Text.fontSize(13);
                        Text.fontColor(this.messageOk ? '#0B7A5B' : '#B7262B');
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    hintSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color(LINE);
            Divider.margin({ top: 16, bottom: 2 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 12, bottom: 10 });
            Row.onClick(() => {
                this.hintOpen = !this.hintOpen;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('预置测试账号');
            Text.fontSize(13);
            Text.fontColor(TEXT_SUB);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.hintOpen ? '收起' : '展开');
            Text.fontSize(13);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(PRIMARY);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.hintOpen) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 6 });
                        Column.width('100%');
                        Column.alignItems(HorizontalAlign.Start);
                        Column.padding(12);
                        Column.backgroundColor('#F7F9FC');
                        Column.borderRadius(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('编号 1001 - 1012，密码均为 123456');
                        Text.fontSize(12);
                        Text.fontColor('#5A6B82');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('示例：1001 张三 · 13800000001 · zhangsan@example.com');
                        Text.fontSize(12);
                        Text.fontColor('#5A6B82');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('1012 刘四为停用状态示例（密码 000000）');
                        Text.fontSize(12);
                        Text.fontColor('#8A6D16');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    loginPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.width('92%');
            Column.padding(20);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(20);
            Column.margin({ top: 16, bottom: 28 });
            Column.shadow({ radius: 24, color: '#14101830', offsetX: 0, offsetY: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('登录账号');
            Text.fontSize(19);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(TEXT_MAIN);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支持用户编号 / 姓名 / 电话 / 邮箱登录');
            Text.fontSize(12);
            Text.fontColor(TEXT_SUB);
            Text.margin({ top: 5 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 12, right: 16 });
            Row.backgroundColor(FIELD_BG);
            Row.borderRadius(14);
            Row.alignItems(VerticalAlign.Center);
            Row.margin({ top: 18 });
        }, Row);
        this.fieldChip.bind(this)('号', PRIMARY, '#E9F0FF');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '编号 / 姓名 / 电话 / 邮箱', text: this.account });
            __TextInput__fieldInput();
            TextInput.type(InputType.Normal);
            TextInput.maxLength(60);
            TextInput.onChange((value: string) => {
                this.account = value;
            });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 12, right: 16 });
            Row.backgroundColor(FIELD_BG);
            Row.borderRadius(14);
            Row.alignItems(VerticalAlign.Center);
            Row.margin({ top: 12 });
        }, Row);
        this.fieldChip.bind(this)('密', PRIMARY, '#E9F0FF');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入密码', text: this.password });
            __TextInput__fieldInput();
            TextInput.type(InputType.Password);
            TextInput.maxLength(20);
            TextInput.onChange((value: string) => {
                this.password = value;
            });
        }, TextInput);
        Row.pop();
        this.messageTip.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.busy ? '登录中…' : '登录');
            Button.width('100%');
            Button.height(50);
            Button.fontSize(17);
            Button.fontWeight(FontWeight.Medium);
            Button.fontColor('#FFFFFF');
            Button.linearGradient({ angle: 90, colors: [['#3568F0', 0], ['#2F6BFF', 1]] });
            Button.borderRadius(14);
            Button.margin({ top: 20 });
            Button.enabled(this.dbReady && !this.busy);
            Button.onClick(() => {
                this.doLogin();
            });
        }, Button);
        Button.pop();
        this.hintSection.bind(this)();
        Column.pop();
    }
    registerPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.width('92%');
            Column.padding(20);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(20);
            Column.margin({ top: 16, bottom: 28 });
            Column.shadow({ radius: 24, color: '#14101830', offsetX: 0, offsetY: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('创建新账号');
            Text.fontSize(19);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(TEXT_MAIN);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('注册信息将写入 SQLite 的 tb_user 表');
            Text.fontSize(12);
            Text.fontColor(TEXT_SUB);
            Text.margin({ top: 5 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 12, right: 16 });
            Row.backgroundColor(FIELD_BG);
            Row.borderRadius(14);
            Row.alignItems(VerticalAlign.Center);
            Row.margin({ top: 18 });
        }, Row);
        this.fieldChip.bind(this)('名', ACCENT_TEXT, '#E4F6F2');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入姓名', text: this.username });
            __TextInput__fieldInput();
            TextInput.type(InputType.Normal);
            TextInput.maxLength(20);
            TextInput.onChange((value: string) => {
                this.username = value;
            });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 12, right: 16 });
            Row.backgroundColor(FIELD_BG);
            Row.borderRadius(14);
            Row.alignItems(VerticalAlign.Center);
            Row.margin({ top: 12 });
        }, Row);
        this.fieldChip.bind(this)('话', ACCENT_TEXT, '#E4F6F2');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入 11 位手机号码', text: this.phone });
            __TextInput__fieldInput();
            TextInput.type(InputType.PhoneNumber);
            TextInput.maxLength(11);
            TextInput.onChange((value: string) => {
                this.phone = value;
            });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 12, right: 16 });
            Row.backgroundColor(FIELD_BG);
            Row.borderRadius(14);
            Row.alignItems(VerticalAlign.Center);
            Row.margin({ top: 12 });
        }, Row);
        this.fieldChip.bind(this)('邮', ACCENT_TEXT, '#E4F6F2');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入电子邮箱', text: this.email });
            __TextInput__fieldInput();
            TextInput.type(InputType.Email);
            TextInput.maxLength(60);
            TextInput.onChange((value: string) => {
                this.email = value;
            });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 12, right: 16 });
            Row.backgroundColor(FIELD_BG);
            Row.borderRadius(14);
            Row.alignItems(VerticalAlign.Center);
            Row.margin({ top: 12 });
        }, Row);
        this.fieldChip.bind(this)('密', ACCENT_TEXT, '#E4F6F2');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '6-20 位密码', text: this.regPassword });
            __TextInput__fieldInput();
            TextInput.type(InputType.Password);
            TextInput.maxLength(20);
            TextInput.onChange((value: string) => {
                this.regPassword = value;
            });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 12, right: 16 });
            Row.backgroundColor(FIELD_BG);
            Row.borderRadius(14);
            Row.alignItems(VerticalAlign.Center);
            Row.margin({ top: 12 });
        }, Row);
        this.fieldChip.bind(this)('确', ACCENT_TEXT, '#E4F6F2');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请再次输入密码', text: this.confirmPassword });
            __TextInput__fieldInput();
            TextInput.type(InputType.Password);
            TextInput.maxLength(20);
            TextInput.onChange((value: string) => {
                this.confirmPassword = value;
            });
        }, TextInput);
        Row.pop();
        this.messageTip.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.busy ? '注册中…' : '完成注册');
            Button.width('100%');
            Button.height(50);
            Button.fontSize(17);
            Button.fontWeight(FontWeight.Medium);
            Button.fontColor('#FFFFFF');
            Button.linearGradient({ angle: 90, colors: [['#0C8F7C', 0], ['#0A7F6E', 1]] });
            Button.borderRadius(14);
            Button.margin({ top: 20 });
            Button.enabled(this.dbReady && !this.busy);
            Button.onClick(() => {
                this.doRegister();
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    infoRow(label: string, value: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(50);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(14);
            Text.fontColor(TEXT_SUB);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.fontSize(15);
            Text.fontColor(TEXT_MAIN);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        Row.pop();
    }
    homePanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.width('92%');
            Column.padding(20);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(20);
            Column.margin({ top: 16, bottom: 28 });
            Column.shadow({ radius: 24, color: '#14101830', offsetX: 0, offsetY: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 14 });
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.loggedUsername.length > 0 ? this.loggedUsername.substring(0, 1) : 'U');
            Text.width(56);
            Text.height(56);
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
            Text.borderRadius(18);
            Text.textAlign(TextAlign.Center);
            Text.align(Alignment.Center);
            Text.linearGradient({ angle: 135, colors: [['#F59E0B', 0], ['#FB923C', 1]] });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`你好，${this.loggedUsername}`);
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(TEXT_MAIN);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`用户编号 ${this.loggedUserId}`);
            Text.fontSize(12);
            Text.fontColor(TEXT_SUB);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('已登录');
            Text.fontSize(11);
            Text.fontColor('#0B7A5B');
            Text.padding({ left: 10, right: 10, top: 5, bottom: 5 });
            Text.backgroundColor('#E7F7F1');
            Text.borderRadius(10);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color(LINE);
            Divider.margin({ top: 18, bottom: 2 });
        }, Divider);
        this.infoRow.bind(this)('姓名', this.loggedUsername);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color(LINE);
        }, Divider);
        this.infoRow.bind(this)('电话', this.loggedTel);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color(LINE);
        }, Divider);
        this.infoRow.bind(this)('邮箱', this.loggedEmail);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color(LINE);
        }, Divider);
        this.infoRow.bind(this)('账号状态', '正常启用');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(14);
            Row.backgroundColor('#EAF7F4');
            Row.borderRadius(14);
            Row.margin({ top: 18 });
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户表记录总数');
            Text.fontSize(13);
            Text.fontColor(TEXT_SUB);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.totalCount} 条`);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(ACCENT_TEXT);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('退出登录');
            Button.width('100%');
            Button.height(48);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Medium);
            Button.fontColor(DANGER);
            Button.backgroundColor('#FDECEC');
            Button.borderRadius(14);
            Button.margin({ top: 18 });
            Button.onClick(() => {
                this.logout();
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.backgroundColor('#F4F6FB');
            Scroll.scrollBar(BarState.Off);
            Scroll.edgeEffect(EdgeEffect.Spring);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.brandHeader.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.pageIndex === 0 || this.pageIndex === 1) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.modeSwitch.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.pageIndex === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.loginPanel.bind(this)();
                });
            }
            else if (this.pageIndex === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.registerPanel.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.homePanel.bind(this)();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
