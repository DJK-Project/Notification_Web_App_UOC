import 'package:animated_login/animated_login.dart';
import 'package:async/async.dart';
import 'package:flutter/material.dart';

import 'dialog_builders.dart';
import 'login_functions.dart';
import 'dart:async';

import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:latlong2/latlong.dart';

/// Main function.
void main() {
  runApp(const MyApp());
}

/// Example app widget.
class MyApp extends StatelessWidget {
  /// Main app widget.
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Animated Login',
      theme: ThemeData(
          primarySwatch: Colors.blue), //const MaterialColor(0xFF6666FF, color)
      debugShowCheckedModeBanner: false,
      initialRoute: '/login',
      routes: {
        '/login': (BuildContext context) => const LoginScreen(),
        '/forgotPass': (BuildContext context) =>  const MyHomePage(title: '',),
      },
    );
  }

  // static const Map<int, Color> color = {
  //   50: Color.fromRGBO(4, 131, 184, .1),
  //   100: Color.fromRGBO(4, 131, 184, .2),
  //   200: Color.fromRGBO(4, 131, 184, .3),
  //   300: Color.fromRGBO(4, 131, 184, .4),
  //   400: Color.fromRGBO(4, 131, 184, .5),
  //   500: Color.fromRGBO(4, 131, 184, .6),
  //   600: Color.fromRGBO(4, 131, 184, .7),
  //   700: Color.fromRGBO(4, 131, 184, .8),
  //   800: Color.fromRGBO(4, 131, 184, .9),
  //   900: Color.fromRGBO(4, 131, 184, 1),
  // };
}

/// Example login screen
class LoginScreen extends StatefulWidget {
  /// Simulates the multilanguage, you will implement your own logic.
  /// According to the current language, you can display a text message
  /// with the help of [LoginTexts] class.
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  /// Example selected language, default is English.
  LanguageOption language = _languageOptions[1];

  /// Current auth mode, default is [AuthMode.login].
  AuthMode currentMode = AuthMode.login;

  CancelableOperation? _operation;

  @override
  Widget build(BuildContext context) {
    return AnimatedLogin(
      onLogin: (LoginData data) async =>
          _authOperation(LoginFunctions(context).onLogin(data)),
      onSignup: (SignUpData data) async =>
          _authOperation(LoginFunctions(context).onSignup(data)),
      onForgotPassword: _onForgotPassword,
      logo: Image.asset('assets/images/logo.gif'),
      // backgroundImage: 'images/background_image.jpg',
      signUpMode: SignUpModes.both,
      loginDesktopTheme: _desktopTheme,
      loginMobileTheme: _mobileTheme,
      loginTexts: _loginTexts,
      changeLanguageCallback: (LanguageOption? _language) {
        if (_language != null) {
          DialogBuilder(context).showResultDialog(language.code == 'EN' ?'A kambia e lenguahe eksitosamente na: ${_language.value}.':'Successfully changed the language to: ${_language.value}.');
          if (mounted) setState(() => language = _language);
        }
      },
      changeLangDefaultOnPressed: () async => _operation?.cancel(),
      languageOptions: _languageOptions,
      selectedLanguage: language,
      initialMode: currentMode,
      onAuthModeChange: (AuthMode newMode) async {
        currentMode = newMode;
        await _operation?.cancel();
      },
    );
  }

  Future<String?> _authOperation(Future<String?> func) async {
    await _operation?.cancel();
    _operation = CancelableOperation.fromFuture(func);
    final String? res = await _operation?.valueOrCancellation();
    if (_operation?.isCompleted == true) {
      DialogBuilder(context).showResultDialog(res ?? 'Successful.');
    }
    return res;
  }

  Future<String?> _onForgotPassword(String email) async {
    await _operation?.cancel();
    return await LoginFunctions(context).onForgotPassword(email);
  }

  static List<LanguageOption> get _languageOptions => const <LanguageOption>[
        LanguageOption(
          value: 'Papiamentu',
          code: 'CW',
          iconPath: 'assets/images/cw.png',
        ),
        LanguageOption(
          value: 'English',
          code: 'EN',
          iconPath: 'assets/images/en.png',
        ),
      ];

  /// You can adjust the colors, text styles, button styles, borders
  /// according to your design preferences for *DESKTOP* view.
  /// You can also set some additional display options such as [showLabelTexts].
  LoginViewTheme get _desktopTheme => _mobileTheme.copyWith(
        // To set the color of button text, use foreground color.
        actionButtonStyle: ButtonStyle(
          foregroundColor: MaterialStateProperty.all(Colors.white),
        ),
        dialogTheme: const AnimatedDialogTheme(
          languageDialogTheme: LanguageDialogTheme(
              optionMargin: EdgeInsets.symmetric(horizontal: 80)),
        ),
        loadingSocialButtonColor: Colors.blue,
        loadingButtonColor: Colors.white,
      );

  /// You can adjust the colors, text styles, button styles, borders
  /// according to your design preferences for *MOBILE* view.
  /// You can also set some additional display options such as [showLabelTexts].
  LoginViewTheme get _mobileTheme => LoginViewTheme(
        // showLabelTexts: false,
        backgroundColor: Colors.blue, // const Color(0xFF6666FF),
        formFieldBackgroundColor: Colors.white,
        formWidthRatio: 60,
        // actionButtonStyle: ButtonStyle(
        //   foregroundColor: MaterialStateProperty.all(Colors.blue),
        // ),
        // animatedComponentOrder: const <AnimatedComponent>[
        //   AnimatedComponent(component: LoginComponents.logo),
        //   AnimatedComponent(component: LoginComponents.title),
        //   AnimatedComponent(component: LoginComponents.description),
        //   AnimatedComponent(component: LoginComponents.formTitle),
        //   AnimatedComponent(component: LoginComponents.socialLogins),
        //   AnimatedComponent(component: LoginComponents.useEmail),
        //   AnimatedComponent(component: LoginComponents.form),
        //   AnimatedComponent(component: LoginComponents.notHaveAnAccount),
        //   AnimatedComponent(component: LoginComponents.forgotPassword),
        //   AnimatedComponent(component: LoginComponents.changeActionButton),
        //   AnimatedComponent(component: LoginComponents.actionButton),
        // ],
      );

  LoginTexts get _loginTexts => LoginTexts(
        welcome : _defaultWelcome,
        welcomeDescription: _defaultWelcomeDescription,
        signUp: _defaultSignUp,
        signUpFormTitle: _defaultSignUpFormTitle,
        signUpUseEmail: _defaultSignUpUseEmail,
        welcomeBack: _defaultWelcomeBack,
        welcomeBackDescription: _defaultWelcomeBackDescription,
        login: _defaultLogin,
        loginFormTitle: _defaultLoginFormTitle,
        loginUseEmail: _defaultLoginUseEmail,
        forgotPassword: _defaultForgotPassword,
        notHaveAnAccount: _defaultnotHaveAnAccount,
        alreadyHaveAnAccount: _defaultAlreadyHaveAnAccount,
        nameHint: _defaultNameHint,
        emailHint: _defaultEmailHint,
        passwordHint: _defaultPasswordHint,
        confirmPasswordHint: _defaultConfirmPasswordHint,
        passwordMatchingError: _defaultPasswordMatchingError,
        dialogButtonText: _defaultDialogButtonText,
        chooseLanguageTitle: _defaultChooseLanguageTitle,
      );

  /// You can adjust the texts in the screen according to the current language
  /// With the help of [LoginTexts], you can create a multilanguage scren.
  String get _defaultWelcome => language.code == 'CW' ? 'Bon Bini!' : 'Welcome!';
  String get _defaultWelcomeDescription => language.code == 'CW' ? "Bo ta kaminda bo ta hañ'é mihó ku bo ta buskando! ":'You are where you find the best you are looking for!';
  String get _defaultSignUp => language.code == 'CW' ? 'Inskribí':'Sign Up';
  String get _defaultSignUpFormTitle => language.code == 'CW' ? 'Krea un Kuenta':'Create an Account';
  String get _defaultSignUpUseEmail => language.code == 'CW' ? 'òf usa bo e-mail pa registra':'or use your email for registration:';
  String get _defaultnotHaveAnAccount => language.code == 'CW' ? 'No tin kuenta?':"Not have an account?";
  String get _defaultWelcomeBack => language.code == 'CW' ? 'Bon Bini bèk!':'Welcome Back!';
  String get _defaultWelcomeBackDescription => language.code == 'CW' ? 'Bon Bini na e mihó. Semper nos ta warda bo!':"Welcome back to the best. We're always here, waiting for you!";
  String get _defaultLogin => language.code == 'CW' ? 'Inisiá Seshon':'Login';
  String get _defaultLoginFormTitle => language.code == 'CW' ? 'Inisiá Seshon di Kuenta ':'Login to Account';
  String get _defaultLoginUseEmail => language.code == 'CW' ? 'òf usa bo kuenta di e-mail':'or use your email account:';
  String get _defaultForgotPassword => language.code == 'CW' ? 'Lubidá kódigo di akseso?':'Forgot Password?';
  String get _defaultAlreadyHaveAnAccount => language.code == 'CW' ? 'Tin kuenta kaba?':'Already have an account?';
  String get _defaultNameHint => language.code == 'CW' ? 'Nòmber di Usuario':'Name';
  String get _defaultEmailHint => language.code == 'CW' ? 'E-mail':'Email';
  String get _defaultPasswordHint => language.code == 'CW' ? 'Kódigo di akseso':'Password';
  String get _defaultConfirmPasswordHint => language.code == 'CW' ? 'konfirmá Kódigo di akseso':'Confirm Password';

  String get _defaultPasswordMatchingError => language.code == 'CW' ? 'E Kódigonan di akseso no ta kuadra, purba atrobe.':'The passwords you entered do not match, check again.';
  String get _defaultDialogButtonText => language.code == 'CW' ? "Ok":'OK';
  String get _defaultChooseLanguageTitle => language.code == 'CW' ? 'Skohe bo lenguahe':'Choose your language';

  /// Social login options, you should provide callback function and icon path.
  /// Icon paths should be the full path in the assets
  /// Don't forget to also add the icon folder to the "pubspec.yaml" file.
}

/// Example forgot password screen
class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  late CenterOnLocationUpdate _centerOnLocationUpdate;
  late StreamController<double?> _centerCurrentLocationStreamController;

  @override
  void initState() {
    super.initState();
    _centerOnLocationUpdate = CenterOnLocationUpdate.always;
    _centerCurrentLocationStreamController = StreamController<double?>();
  }

  @override
  void dispose() {
    _centerCurrentLocationStreamController.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Geolocation App"),
      ),
      body: FlutterMap(
        options: MapOptions(
          center: LatLng(12.169570,-68.990021),
          zoom: 11,
          maxZoom: 19,
          onPositionChanged: (MapPosition position, bool hasGesture) {
            if (hasGesture) {
              setState(
                    () => _centerOnLocationUpdate = CenterOnLocationUpdate.never,
              );
            }
          },
        ),
        children: [
          TileLayerWidget(options: TileLayerOptions(
            urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains: ['a', 'b', 'c'],
            maxZoom: 19,
          )),
          LocationMarkerLayerWidget(
            plugin: LocationMarkerPlugin(
              centerCurrentLocationStream:
              _centerCurrentLocationStreamController.stream,
              centerOnLocationUpdate: _centerOnLocationUpdate,
            ),
          ),
        ],
        nonRotatedChildren: [
          Positioned(
            right: 20,
            bottom: 20,
            child: FloatingActionButton(
              onPressed: () {
                // Automatically center the location marker on the map when location updated until user interact with the map.
                setState(
                      () => _centerOnLocationUpdate = CenterOnLocationUpdate.always,
                );
                // Center the location marker on the map and zoom the map to level 18.
                _centerCurrentLocationStreamController.add(18);
              },
              child: const Icon(
                Icons.my_location,
              ),
            ),
          )
        ],
      ),
    );
  }
}
