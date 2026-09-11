import { UserDatabase } from '../database/UserDatabase';
import { AuthResult } from '../model/User';

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

@Extend(TextInput)
function fieldInput() {
  .layoutWeight(1)
  .height(52)
  .margin({ left: 10 })
  .padding(0)
  .fontSize(16)
  .fontColor(TEXT_MAIN)
  .backgroundColor(Color.Transparent)
  .borderRadius(0)
  .placeholderColor(TEXT_HINT)
  .placeholderFont({ size: 15 })
  .caretColor(PRIMARY)
  .showUnderline(false)
}

@Entry
@Component
struct Index {
  @State pageIndex: number = 0
  @State dbReady: boolean = false
  @State busy: boolean = false
  @State totalCount: number = 0
  @State message: string = ''
  @State messageOk: boolean = false
  @State hintOpen: boolean = false

  @State account: string = ''
  @State password: string = ''
  @State username: string = ''
  @State regPassword: string = ''
  @State confirmPassword: string = ''
  @State phone: string = ''
  @State email: string = ''

  @State loggedUserId: number = 0
  @State loggedUsername: string = ''
  @State loggedTel: string = ''
  @State loggedEmail: string = ''

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
    } catch (err) {
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
      } else {
        this.setMessage(result.message, false);
      }
    } catch (err) {
      const reason: string = `${err}`;
      this.setMessage(`登录失败：${reason}`, false);
    } finally {
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
      const result: AuthResult = await UserDatabase.register(
        this.username.trim(),
        this.regPassword,
        this.phone.trim(),
        this.email.trim()
      );
      if (result.success) {
        this.totalCount = await UserDatabase.getUserCount();
        const registeredName: string = this.username.trim();
        this.clearRegisterForm();
        this.account = registeredName;
        this.switchPage(0);
        this.setMessage(`注册成功，用户编号 ${result.newUserId}，请使用该账号登录`, true);
      } else {
        this.setMessage(result.message, false);
      }
    } catch (err) {
      const reason: string = `${err}`;
      this.setMessage(`注册失败：${reason}`, false);
    } finally {
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

  @Styles
  cardStyle() {
    .width('92%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(20)
    .margin({ top: 16, bottom: 28 })
    .shadow({ radius: 24, color: '#14101830', offsetX: 0, offsetY: 8 })
  }

  @Builder
  fieldChip(label: string, color: string, background: string) {
    Text(label)
      .width(30)
      .height(30)
      .fontSize(13)
      .fontWeight(FontWeight.Medium)
      .fontColor(color)
      .backgroundColor(background)
      .borderRadius(9)
      .textAlign(TextAlign.Center)
      .align(Alignment.Center)
  }

  @Builder
  brandHeader() {
    Column() {
      Row({ space: 12 }) {
        Text('U')
          .width(46)
          .height(46)
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
          .backgroundColor('#33FFFFFF')
          .borderRadius(15)
          .textAlign(TextAlign.Center)
          .align(Alignment.Center)
        Column() {
          Text('用户中心')
            .fontSize(23)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
          Text('登录 · 注册 · SQLite 数据管理')
            .fontSize(12)
            .fontColor('#DCE9FF')
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)

      Row({ space: 8 }) {
        if (this.dbReady) {
          Row()
            .width(8)
            .height(8)
            .borderRadius(4)
            .backgroundColor('#12A67D')
        } else {
          LoadingProgress()
            .width(14)
            .height(14)
            .color(PRIMARY)
        }
        Text(this.dbReady ? `SQLite 已就绪 · tb_user ${this.totalCount} 条记录` : '正在初始化数据库…')
          .fontSize(12)
          .fontWeight(FontWeight.Medium)
          .fontColor('#2F5BD6')
      }
      .padding({ left: 12, right: 12, top: 7, bottom: 7 })
      .backgroundColor('#FFFFFF')
      .borderRadius(14)
      .margin({ top: 16 })
      .alignItems(VerticalAlign.Center)
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .padding({ top: 30, bottom: 26, left: 24, right: 24 })
    .linearGradient({
      angle: 145,
      colors: [['#1D4ED8', 0], ['#3B82F6', 0.55], ['#5AC8F5', 1]]
    })
    .borderRadius({ bottomLeft: 28, bottomRight: 28 })
    .clip(true)
  }

  @Builder
  modeSwitch() {
    Row({ space: 4 }) {
      Text('用户登录')
        .layoutWeight(1)
        .height(42)
        .fontSize(15)
        .fontWeight(this.pageIndex === 0 ? FontWeight.Medium : FontWeight.Normal)
        .fontColor(this.pageIndex === 0 ? '#FFFFFF' : TEXT_SUB)
        .textAlign(TextAlign.Center)
        .backgroundColor(this.pageIndex === 0 ? PRIMARY : Color.Transparent)
        .borderRadius(12)
        .onClick(() => {
          this.getUIContext().animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
            this.switchPage(0);
          });
        })
      Text('注册账号')
        .layoutWeight(1)
        .height(42)
        .fontSize(15)
        .fontWeight(this.pageIndex === 1 ? FontWeight.Medium : FontWeight.Normal)
        .fontColor(this.pageIndex === 1 ? '#FFFFFF' : TEXT_SUB)
        .textAlign(TextAlign.Center)
        .backgroundColor(this.pageIndex === 1 ? ACCENT : Color.Transparent)
        .borderRadius(12)
        .onClick(() => {
          this.getUIContext().animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
            this.switchPage(1);
          });
        })
    }
    .width('92%')
    .padding(4)
    .backgroundColor('#FFFFFF')
    .borderRadius(16)
    .margin({ top: 16 })
    .shadow({ radius: 18, color: '#0F2F6BFF', offsetX: 0, offsetY: 6 })
  }

  @Builder
  messageTip() {
    if (this.message.length > 0) {
      Row({ space: 8 }) {
        Text(this.messageOk ? '✓' : '!')
          .width(18)
          .height(18)
          .fontSize(12)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
          .backgroundColor(this.messageOk ? ACCENT_TEXT : '#E5484D')
          .borderRadius(9)
          .textAlign(TextAlign.Center)
          .align(Alignment.Center)
        Text(this.message)
          .layoutWeight(1)
          .fontSize(13)
          .fontColor(this.messageOk ? '#0B7A5B' : '#B7262B')
      }
      .width('100%')
      .padding({ left: 12, right: 12, top: 10, bottom: 10 })
      .backgroundColor(this.messageOk ? '#E7F7F1' : '#FDECEC')
      .borderRadius(12)
      .alignItems(VerticalAlign.Center)
      .margin({ top: 14 })
    }
  }

  @Builder
  hintSection() {
    Column() {
      Divider()
        .color(LINE)
        .margin({ top: 16, bottom: 2 })
      Row() {
        Text('预置测试账号')
          .fontSize(13)
          .fontColor(TEXT_SUB)
        Blank()
        Text(this.hintOpen ? '收起' : '展开')
          .fontSize(13)
          .fontWeight(FontWeight.Medium)
          .fontColor(PRIMARY)
      }
      .width('100%')
      .padding({ top: 12, bottom: 10 })
      .onClick(() => {
        this.hintOpen = !this.hintOpen;
      })

      if (this.hintOpen) {
        Column({ space: 6 }) {
          Text('编号 1001 - 1012，密码均为 123456')
            .fontSize(12)
            .fontColor('#5A6B82')
          Text('示例：1001 张三 · 13800000001 · zhangsan@example.com')
            .fontSize(12)
            .fontColor('#5A6B82')
          Text('1012 刘四为停用状态示例（密码 000000）')
            .fontSize(12)
            .fontColor('#8A6D16')
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
        .padding(12)
        .backgroundColor('#F7F9FC')
        .borderRadius(12)
      }
    }
    .width('100%')
  }

  @Builder
  loginPanel() {
    Column() {
      Text('登录账号')
        .fontSize(19)
        .fontWeight(FontWeight.Bold)
        .fontColor(TEXT_MAIN)
      Text('支持用户编号 / 姓名 / 电话 / 邮箱登录')
        .fontSize(12)
        .fontColor(TEXT_SUB)
        .margin({ top: 5 })

      Row() {
        this.fieldChip('号', PRIMARY, '#E9F0FF')
        TextInput({ placeholder: '编号 / 姓名 / 电话 / 邮箱', text: this.account })
          .fieldInput()
          .type(InputType.Normal)
          .maxLength(60)
          .onChange((value: string) => {
            this.account = value;
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .backgroundColor(FIELD_BG)
      .borderRadius(14)
      .alignItems(VerticalAlign.Center)
      .margin({ top: 18 })

      Row() {
        this.fieldChip('密', PRIMARY, '#E9F0FF')
        TextInput({ placeholder: '请输入密码', text: this.password })
          .fieldInput()
          .type(InputType.Password)
          .maxLength(20)
          .onChange((value: string) => {
            this.password = value;
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .backgroundColor(FIELD_BG)
      .borderRadius(14)
      .alignItems(VerticalAlign.Center)
      .margin({ top: 12 })

      this.messageTip()

      Button(this.busy ? '登录中…' : '登录')
        .width('100%')
        .height(50)
        .fontSize(17)
        .fontWeight(FontWeight.Medium)
        .fontColor('#FFFFFF')
        .linearGradient({ angle: 90, colors: [['#3568F0', 0], ['#2F6BFF', 1]] })
        .borderRadius(14)
        .margin({ top: 20 })
        .enabled(this.dbReady && !this.busy)
        .onClick(() => {
          this.doLogin();
        })

      this.hintSection()
    }
    .alignItems(HorizontalAlign.Start)
    .cardStyle()
  }

  @Builder
  registerPanel() {
    Column() {
      Text('创建新账号')
        .fontSize(19)
        .fontWeight(FontWeight.Bold)
        .fontColor(TEXT_MAIN)
      Text('注册信息将写入 SQLite 的 tb_user 表')
        .fontSize(12)
        .fontColor(TEXT_SUB)
        .margin({ top: 5 })

      Row() {
        this.fieldChip('名', ACCENT_TEXT, '#E4F6F2')
        TextInput({ placeholder: '请输入姓名', text: this.username })
          .fieldInput()
          .type(InputType.Normal)
          .maxLength(20)
          .onChange((value: string) => {
            this.username = value;
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .backgroundColor(FIELD_BG)
      .borderRadius(14)
      .alignItems(VerticalAlign.Center)
      .margin({ top: 18 })

      Row() {
        this.fieldChip('话', ACCENT_TEXT, '#E4F6F2')
        TextInput({ placeholder: '请输入 11 位手机号码', text: this.phone })
          .fieldInput()
          .type(InputType.PhoneNumber)
          .maxLength(11)
          .onChange((value: string) => {
            this.phone = value;
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .backgroundColor(FIELD_BG)
      .borderRadius(14)
      .alignItems(VerticalAlign.Center)
      .margin({ top: 12 })

      Row() {
        this.fieldChip('邮', ACCENT_TEXT, '#E4F6F2')
        TextInput({ placeholder: '请输入电子邮箱', text: this.email })
          .fieldInput()
          .type(InputType.Email)
          .maxLength(60)
          .onChange((value: string) => {
            this.email = value;
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .backgroundColor(FIELD_BG)
      .borderRadius(14)
      .alignItems(VerticalAlign.Center)
      .margin({ top: 12 })

      Row() {
        this.fieldChip('密', ACCENT_TEXT, '#E4F6F2')
        TextInput({ placeholder: '6-20 位密码', text: this.regPassword })
          .fieldInput()
          .type(InputType.Password)
          .maxLength(20)
          .onChange((value: string) => {
            this.regPassword = value;
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .backgroundColor(FIELD_BG)
      .borderRadius(14)
      .alignItems(VerticalAlign.Center)
      .margin({ top: 12 })

      Row() {
        this.fieldChip('确', ACCENT_TEXT, '#E4F6F2')
        TextInput({ placeholder: '请再次输入密码', text: this.confirmPassword })
          .fieldInput()
          .type(InputType.Password)
          .maxLength(20)
          .onChange((value: string) => {
            this.confirmPassword = value;
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .backgroundColor(FIELD_BG)
      .borderRadius(14)
      .alignItems(VerticalAlign.Center)
      .margin({ top: 12 })

      this.messageTip()

      Button(this.busy ? '注册中…' : '完成注册')
        .width('100%')
        .height(50)
        .fontSize(17)
        .fontWeight(FontWeight.Medium)
        .fontColor('#FFFFFF')
        .linearGradient({ angle: 90, colors: [['#0C8F7C', 0], ['#0A7F6E', 1]] })
        .borderRadius(14)
        .margin({ top: 20 })
        .enabled(this.dbReady && !this.busy)
        .onClick(() => {
          this.doRegister();
        })
    }
    .alignItems(HorizontalAlign.Start)
    .cardStyle()
  }

  @Builder
  infoRow(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor(TEXT_SUB)
      Blank()
      Text(value)
        .fontSize(15)
        .fontColor(TEXT_MAIN)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
    }
    .width('100%')
    .height(50)
  }

  @Builder
  homePanel() {
    Column() {
      Row({ space: 14 }) {
        Text(this.loggedUsername.length > 0 ? this.loggedUsername.substring(0, 1) : 'U')
          .width(56)
          .height(56)
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
          .borderRadius(18)
          .textAlign(TextAlign.Center)
          .align(Alignment.Center)
          .linearGradient({ angle: 135, colors: [['#F59E0B', 0], ['#FB923C', 1]] })
        Column() {
          Text(`你好，${this.loggedUsername}`)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(TEXT_MAIN)
          Text(`用户编号 ${this.loggedUserId}`)
            .fontSize(12)
            .fontColor(TEXT_SUB)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        Text('已登录')
          .fontSize(11)
          .fontColor('#0B7A5B')
          .padding({ left: 10, right: 10, top: 5, bottom: 5 })
          .backgroundColor('#E7F7F1')
          .borderRadius(10)
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)

      Divider()
        .color(LINE)
        .margin({ top: 18, bottom: 2 })

      this.infoRow('姓名', this.loggedUsername)
      Divider()
        .color(LINE)
      this.infoRow('电话', this.loggedTel)
      Divider()
        .color(LINE)
      this.infoRow('邮箱', this.loggedEmail)
      Divider()
        .color(LINE)
      this.infoRow('账号状态', '正常启用')

      Row() {
        Text('用户表记录总数')
          .fontSize(13)
          .fontColor(TEXT_SUB)
        Blank()
        Text(`${this.totalCount} 条`)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(ACCENT_TEXT)
      }
      .width('100%')
      .padding(14)
      .backgroundColor('#EAF7F4')
      .borderRadius(14)
      .margin({ top: 18 })
      .alignItems(VerticalAlign.Center)

      Button('退出登录')
        .width('100%')
        .height(48)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(DANGER)
        .backgroundColor('#FDECEC')
        .borderRadius(14)
        .margin({ top: 18 })
        .onClick(() => {
          this.logout();
        })
    }
    .alignItems(HorizontalAlign.Start)
    .cardStyle()
  }

  build() {
    Scroll() {
      Column() {
        this.brandHeader()
        if (this.pageIndex === 0 || this.pageIndex === 1) {
          this.modeSwitch()
        }
        if (this.pageIndex === 0) {
          this.loginPanel()
        } else if (this.pageIndex === 1) {
          this.registerPanel()
        } else {
          this.homePanel()
        }
      }
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F4F6FB')
    .scrollBar(BarState.Off)
    .edgeEffect(EdgeEffect.Spring)
  }
}
