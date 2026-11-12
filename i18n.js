'use strict';
/* Proofy — переводы интерфейса.
   Исходный язык разметки — русский. Для остальных языков текстовые узлы
   заменяются по словарю: [ru, kk, en, tr, zh]. */

const LANGS = [
  { code: 'kk', label: 'Қазақша', short: 'KZ' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'tr', label: 'Türkçe', short: 'TR' },
  { code: 'zh', label: '中文', short: '中' },
];

const DICT_ROWS = [
  // Навигация и шапка
  ['Главная', 'Басты бет', 'Home', 'Ana sayfa', '首页'],
  ['Проверка', 'Тексеру', 'Verify', 'Doğrulama', '验证'],
  ['Рейтинг', 'Рейтинг', 'Ranking', 'Sıralama', '排行'],
  ['Организаторам', 'Ұйымдастырушыларға', 'Organizers', 'Organizatörler', '主办方'],
  ['Школьникам', 'Оқушыларға', 'Students', 'Öğrenciler', '学生'],
  ['Вузам', 'ЖОО-ларға', 'Universities', 'Üniversiteler', '高校'],
  ['Организатор', 'Ұйымдастырушы', 'Organizer', 'Organizatör', '主办方'],
  ['Школьник', 'Оқушы', 'Student', 'Öğrenci', '学生'],
  ['Вузы', 'ЖОО', 'Universities', 'Üniversiteler', '高校'],
  ['API · онлайн', 'API · онлайн', 'API · online', 'API · çevrimiçi', 'API · 在线'],
  ['Наверх', 'Жоғарыға', 'To top', 'Yukarı', '回到顶部'],
  // Интро
  ['СЕРТИФИКАТ', 'СЕРТИФИКАТ', 'CERTIFICATE', 'SERTİFİKA', '证书'],
  ['ПОДЛИННЫЙ', 'ТҮПНҰСҚА', 'AUTHENTIC', 'GERÇEK', '真实'],
  ['Талант виден.', 'Талант көрінеді.', 'Talent is seen.', 'Yetenek görünür.', '才华被看见。'],
  ['Подделка — нет.', 'Жалған — жоқ.', 'Fakes are not.', 'Sahtesi değil.', '伪造无处藏身。'],
  ['Пропустить', 'Өткізу', 'Skip', 'Geç', '跳过'],
  ['Листайте вниз', 'Төмен айналдырыңыз', 'Scroll down', 'Aşağı kaydırın', '向下滚动'],
  // Подвал
  ['Прототип для Gambit Hackathon 2026 · трек HackHub «Талант до вуза». Все имена и данные тестовые.', 'Gambit Hackathon 2026 прототипі · HackHub «ЖОО-ға дейінгі талант» трегі. Барлық есімдер мен деректер — тестілік.', 'Prototype for Gambit Hackathon 2026 · HackHub track “Talent before university”. All names and data are test data.', 'Gambit Hackathon 2026 prototipi · HackHub “Üniversite öncesi yetenek” parkuru. Tüm isim ve veriler test amaçlıdır.', 'Gambit Hackathon 2026 原型 · HackHub“大学前的人才”赛道。所有姓名和数据均为测试数据。'],
  ['Набор для питча', 'Питчке арналған жинақ', 'Pitch kit', 'Sunum seti', '路演套件'],
  ['Показать интро', 'Интроны көрсету', 'Replay intro', 'Girişi göster', '重播开场'],
  ['Сбросить демо-данные', 'Демо-деректерді тастау', 'Reset demo data', 'Demo verilerini sıfırla', '重置演示数据'],
  // Герой
  ['Реестр достижений школьников', 'Оқушылар жетістіктерінің тізілімі', 'Registry of student achievements', 'Öğrenci başarıları sicili', '学生成就登记册'],
  ['Организатор выдаёт сертификат с QR. Вуз или агентство проверяет его за 5 секунд и видит, чего стоит конкурс.', 'Ұйымдастырушы QR бар сертификат береді. ЖОО немесе агенттік оны 5 секундта тексеріп, байқаудың құнын көреді.', 'The organizer issues a certificate with a QR code. A university or agency verifies it in 5 seconds and sees what the contest is worth.', 'Organizatör QR kodlu sertifika verir. Üniversite veya ajans 5 saniyede doğrular ve yarışmanın değerini görür.', '主办方颁发带二维码的证书。高校或机构 5 秒即可验证，并看到比赛的真实分量。'],
  ['Проверить сертификат', 'Сертификатты тексеру', 'Verify a certificate', 'Sertifika doğrula', '验证证书'],
  ['Найти таланты', 'Таланттарды табу', 'Find talent', 'Yetenek bul', '寻找人才'],
  ['Проверено за', 'Тексерілді:', 'Verified in', 'Doğrulama süresi', '验证用时'],
  ['0,2 с', '0,2 с', '0.2 s', '0,2 sn', '0.2 秒'],
  ['Хромтау → вуз', 'Хромтау → ЖОО', 'Khromtau → university', 'Hromtau → üniversite', '赫罗姆套 → 高校'],
  ['сертификатов в реестре', 'тізілімдегі сертификат', 'certificates in the registry', 'sicildeki sertifika', '份登记证书'],
  ['сертификата в реестре', 'тізілімдегі сертификат', 'certificates in the registry', 'sicildeki sertifika', '份登记证书'],
  ['сертификат в реестре', 'тізілімдегі сертификат', 'certificate in the registry', 'sicildeki sertifika', '份登记证书'],
  ['подтверждённых организатора', 'расталған ұйымдастырушы', 'verified organizers', 'doğrulanmış organizatör', '个认证主办方'],
  ['городов, включая малые', 'қала, шағын қалаларды қоса', 'cities, including small towns', 'şehir, küçük kasabalar dahil', '个城市，包括小城镇'],
  ['секунд на одну проверку', 'секунд бір тексеруге', 'seconds per check', 'saniyede bir doğrulama', '秒完成一次验证'],
  // Как работает
  ['Как это работает', 'Бұл қалай жұмыс істейді', 'How it works', 'Nasıl çalışır', '运作方式'],
  ['Три шага, никаких «загрузите грамоту»', 'Үш қадам, «грамотаны жүктеңіз» деген жоқ', 'Three steps, no “upload your diploma”', 'Üç adım, “diplomanı yükle” yok', '三步完成，无需“上传奖状”'],
  ['Организатор выдаёт', 'Ұйымдастырушы береді', 'The organizer issues', 'Organizatör verir', '主办方颁发'],
  ['Загружает список призёров. Каждый получает сертификат с ID и QR.', 'Жүлдегерлер тізімін жүктейді. Әркім ID және QR бар сертификат алады.', 'Uploads the list of winners. Each gets a certificate with an ID and QR.', 'Kazananlar listesini yükler. Her biri ID ve QR’lı sertifika alır.', '上传获奖名单，每人获得带 ID 和二维码的证书。'],
  ['Школьник решает', 'Оқушы шешеді', 'The student decides', 'Öğrenci karar verir', '学生做主'],
  ['Профиль скрыт. В поиск — только с согласия родителя.', 'Профиль жасырын. Іздеуге тек ата-ананың келісімімен.', 'The profile is hidden. Search only with parental consent.', 'Profil gizlidir. Aramaya yalnızca veli onayıyla.', '档案默认隐藏，须经家长同意才可被搜索。'],
  ['Вуз проверяет', 'ЖОО тексереді', 'The university verifies', 'Üniversite doğrular', '高校验证'],
  ['Видит «подлинный или нет» и вес конкурса.', '«Түпнұсқа ма, жоқ па» және байқаудың салмағын көреді.', 'Sees “authentic or not” and the contest weight.', '“Gerçek mi değil mi” ve yarışmanın ağırlığını görür.', '看到“真伪”及比赛权重。'],
  // Было / стало
  ['Было и стало', 'Бұрын және қазір', 'Before and after', 'Önce ve sonra', '前后对比'],
  ['Грамоту можно нарисовать. Подпись — нет.', 'Грамотаны салуға болады. Қолтаңбаны — жоқ.', 'A diploma can be drawn. A signature can’t.', 'Diploma çizilebilir. İmza çizilemez.', '奖状可以伪造，签名不能。'],
  ['Сейчас', 'Қазір', 'Today', 'Bugün', '现在'],
  ['С Proofy', 'Proofy-мен', 'With Proofy', 'Proofy ile', '使用 Proofy'],
  ['ГРАМОТА', 'ГРАМОТА', 'DIPLOMA', 'DİPLOMA', '奖状'],
  ['награждается', 'марапатталады', 'is awarded to', 'ödüllendirilir', '授予'],
  ['за I место в международной олимпиаде', 'халықаралық олимпиададағы I орны үшін', 'for 1st place in an international olympiad', 'uluslararası olimpiyatta 1.lik için', '国际奥赛第一名'],
  ['ПЕЧАТЬ', 'МӨР', 'SEAL', 'MÜHÜR', '印章'],
  ['подпись ____', 'қолы ____', 'signature ____', 'imza ____', '签名 ____'],
  ['Нарисовать — 2 минуты в редакторе', 'Салу — редакторда 2 минут', 'Faking takes 2 minutes in an editor', 'Sahtesi editörde 2 dakika', '编辑器里 2 分钟就能伪造'],
  ['Проверить — звонить организатору', 'Тексеру — ұйымдастырушыға қоңырау шалу', 'Checking means calling the organizer', 'Doğrulamak için organizatörü aramak gerekir', '核实只能打电话给主办方'],
  ['Неясно, чего стоит конкурс', 'Байқаудың құны белгісіз', 'Unclear what the contest is worth', 'Yarışmanın değeri belirsiz', '不清楚比赛含金量'],
  ['Подпись организатора ECDSA', 'Ұйымдастырушының ECDSA қолтаңбасы', 'Organizer’s ECDSA signature', 'Organizatörün ECDSA imzası', '主办方 ECDSA 签名'],
  ['Проверка по QR за 5 секунд', 'QR арқылы 5 секундта тексеру', 'QR check in 5 seconds', '5 saniyede QR doğrulama', '扫码 5 秒验证'],
  ['Вес конкурса из 100', 'Байқау салмағы 100-ден', 'Contest weight out of 100', '100 üzerinden yarışma ağırlığı', '比赛权重（满分 100）'],
  // Телефон
  ['Для приёмной комиссии', 'Қабылдау комиссиясы үшін', 'For admissions offices', 'Kabul ofisleri için', '面向招生办'],
  ['Навёл камеру — получил ответ', 'Камераны бағыттадың — жауап алдың', 'Point the camera, get the answer', 'Kamerayı tut, cevabı al', '对准镜头，立得答案'],
  ['Без приложений и регистрации. Обычная камера телефона, одна секунда.', 'Қосымшасыз және тіркеусіз. Телефонның қарапайым камерасы, бір секунд.', 'No apps, no sign-up. Just a phone camera and one second.', 'Uygulama yok, kayıt yok. Telefon kamerası ve bir saniye.', '无需下载应用或注册，用手机相机一秒即可。'],
  ['Камера видит QR на сертификате', 'Камера сертификаттағы QR-ды көреді', 'The camera sees the QR on the certificate', 'Kamera sertifikadaki QR’ı görür', '相机识别证书上的二维码'],
  ['Proofy сверяет подпись организатора', 'Proofy ұйымдастырушы қолтаңбасын тексереді', 'Proofy checks the organizer’s signature', 'Proofy organizatör imzasını kontrol eder', 'Proofy 校验主办方签名'],
  ['Зелёный — подлинный. Красный — подделка', 'Жасыл — түпнұсқа. Қызыл — жалған', 'Green is authentic. Red is fake', 'Yeşil gerçek. Kırmızı sahte', '绿色为真，红色为假'],
  ['Попробовать сканер', 'Сканерді байқап көру', 'Try the scanner', 'Tarayıcıyı dene', '试用扫描器'],
  ['Наведите на QR', 'QR-ға бағыттаңыз', 'Point at the QR', 'QR’a doğrultun', '对准二维码'],
  ['Подлинный', 'Түпнұсқа', 'Authentic', 'Gerçek', '真实'],
  ['Подделка', 'Жалған', 'Fake', 'Sahte', '伪造'],
  ['подпись верна', 'қолтаңба дұрыс', 'signature valid', 'imza geçerli', '签名有效'],
  ['Такого сертификата', 'Мұндай сертификат', 'This certificate', 'Bu sertifika', '该证书'],
  ['нет в реестре', 'тізілімде жоқ', 'is not in the registry', 'sicilde yok', '不在登记册中'],
  // Лаборатория веса
  ['Попробуйте сами', 'Өзіңіз байқап көріңіз', 'Try it yourself', 'Kendiniz deneyin', '亲自试试'],
  ['Сколько весит грамота?', 'Грамотаның салмағы қанша?', 'How much is a diploma worth?', 'Bir diploma ne kadar değerli?', '一张奖状值多少？'],
  ['«Международная» не значит сильная. Двигайте ползунки — вес пересчитается.', '«Халықаралық» күшті дегенді білдірмейді. Жүгірткілерді жылжытыңыз — салмақ қайта есептеледі.', '“International” doesn’t mean strong. Move the sliders and the weight updates.', '“Uluslararası” güçlü demek değildir. Kaydırıcıları oynatın, ağırlık güncellenir.', '“国际”不等于“含金量高”。拖动滑块，权重实时更新。'],
  ['Областная олимпиада', 'Облыстық олимпиада', 'Regional olympiad', 'Bölgesel olimpiyat', '州级奥赛'],
  ['Платная «международная»', 'Ақылы «халықаралық»', 'Paid “international”', 'Ücretli “uluslararası”', '付费“国际赛”'],
  ['Уровень', 'Деңгей', 'Level', 'Seviye', '级别'],
  ['Школьный', 'Мектептік', 'School', 'Okul', '校级'],
  ['Городской', 'Қалалық', 'City', 'Şehir', '市级'],
  ['Областной', 'Облыстық', 'Regional', 'Bölgesel', '州级'],
  ['Республиканский', 'Республикалық', 'National', 'Ulusal', '国家级'],
  ['Международный', 'Халықаралық', 'International', 'Uluslararası', '国际级'],
  ['Участников:', 'Қатысушылар:', 'Participants:', 'Katılımcı:', '参赛人数：'],
  ['Наградили:', 'Марапатталды:', 'Awarded:', 'Ödül alan:', '获奖比例：'],
  ['Есть отбор', 'Іріктеу бар', 'Has selection', 'Eleme var', '有选拔'],
  ['Платное участие', 'Ақылы қатысу', 'Paid entry', 'Ücretli katılım', '付费参赛'],
  ['Организатор подтверждён', 'Ұйымдастырушы расталған', 'Organizer verified', 'Organizatör doğrulandı', '主办方已认证'],
  ['из 100', '100-ден', 'of 100', '100 üzerinden', '/ 100'],
  ['Сильный конкурс', 'Мықты байқау', 'Strong contest', 'Güçlü yarışma', '高含金量比赛'],
  ['Средний вес', 'Орташа салмақ', 'Medium weight', 'Orta ağırlık', '中等权重'],
  ['Почти ничего не значит', 'Іс жүзінде ештеңе білдірмейді', 'Means almost nothing', 'Neredeyse hiçbir anlamı yok', '几乎没有分量'],
  ['Итого', 'Барлығы', 'Total', 'Toplam', '合计'],
  ['Есть отборочный этап', 'Іріктеу кезеңі бар', 'Has a qualifying round', 'Eleme turu var', '设有选拔赛'],
  ['Организатор не подтверждён', 'Ұйымдастырушы расталмаған', 'Organizer not verified', 'Organizatör doğrulanmadı', '主办方未认证'],
  ['Платное участие без отбора', 'Іріктеусіз ақылы қатысу', 'Paid entry without selection', 'Elemesiz ücretli katılım', '付费且无选拔'],
  // Карта
  ['Разрыв видимости', 'Көріну олқылығы', 'The visibility gap', 'Görünürlük açığı', '可见度鸿沟'],
  ['Вузы смотрят в две точки. Таланты — по всей стране.', 'ЖОО-лар екі нүктеге қарайды. Таланттар — бүкіл елде.', 'Universities look at two points. Talent is everywhere.', 'Üniversiteler iki noktaya bakıyor. Yetenek her yerde.', '高校只盯着两座城市，人才却遍布全国。'],
  ['Золотые точки — где ищут сейчас. Голубые — школьники, которых Proofy делает видимыми.', 'Алтын нүктелер — қазір іздейтін жерлер. Көгілдірлер — Proofy көрінетін ететін оқушылар.', 'Gold dots are where they search today. Blue dots are students Proofy makes visible.', 'Altın noktalar bugün arananlar. Mavi noktalar Proofy’ın görünür kıldığı öğrenciler.', '金点：目前的招募重点；蓝点：Proofy 让其被看见的学生。'],
  ['Где ищут сейчас', 'Қазір қайда іздейді', 'Where they search today', 'Bugün arananlar', '目前招募地'],
  ['Проверенные школьники · число', 'Тексерілген оқушылар · саны', 'Verified students · count', 'Doğrulanmış öğrenciler · sayı', '已验证学生 · 人数'],
  ['Схема, не в масштабе', 'Сызба, масштабсыз', 'Schematic, not to scale', 'Şema, ölçeksiz', '示意图，非实际比例'],
  ['Астана', 'Астана', 'Astana', 'Astana', '阿斯塔纳'],
  ['Алматы', 'Алматы', 'Almaty', 'Almatı', '阿拉木图'],
  ['Актобе', 'Ақтөбе', 'Aktobe', 'Aktöbe', '阿克托别'],
  ['Хромтау', 'Хромтау', 'Khromtau', 'Hromtau', '赫罗姆套'],
  ['Кандыагаш', 'Қандыағаш', 'Kandyagash', 'Kandıağaş', '坎迪阿加什'],
  ['Шалкар', 'Шалқар', 'Shalkar', 'Şalkar', '沙尔卡尔'],
  ['Эмба', 'Ембі', 'Emba', 'Emba', '恩巴'],
  ['Уральск', 'Орал', 'Oral', 'Oral', '乌拉尔斯克'],
  ['Атырау', 'Атырау', 'Atyrau', 'Atırau', '阿特劳'],
  ['Костанай', 'Қостанай', 'Kostanay', 'Kostanay', '科斯塔奈'],
  ['Караганда', 'Қарағанды', 'Karaganda', 'Karaganda', '卡拉干达'],
  ['Павлодар', 'Павлодар', 'Pavlodar', 'Pavlodar', '巴甫洛达尔'],
  ['Усть-Каменогорск', 'Өскемен', 'Oskemen', 'Öskemen', '厄斯克门'],
  ['Шымкент', 'Шымкент', 'Shymkent', 'Şımkent', '奇姆肯特'],
  ['Кызылорда', 'Қызылорда', 'Kyzylorda', 'Kızılorda', '克孜勒奥尔达'],
  ['Тараз', 'Тараз', 'Taraz', 'Taraz', '塔拉兹'],
  ['Хромтау → вуз', 'Хромтау → ЖОО', 'Khromtau → university', 'Hromtau → üniversite', '赫罗姆套 → 高校'],
  // Приватность и роли
  ['Данные несовершеннолетних', 'Кәмелетке толмағандардың деректері', 'Data of minors', 'Reşit olmayanların verileri', '未成年人数据'],
  ['Приватность по умолчанию', 'Әдепкі бойынша құпиялылық', 'Private by default', 'Varsayılan olarak gizli', '默认隐私保护'],
  ['Скрыт с первого дня', 'Алғашқы күннен жасырын', 'Hidden from day one', 'İlk günden gizli', '从第一天起隐藏'],
  ['Профиль не виден никому', 'Профиль ешкімге көрінбейді', 'The profile is visible to no one', 'Profil kimseye görünmez', '档案对任何人不可见'],
  ['Согласие родителя', 'Ата-ана келісімі', 'Parental consent', 'Veli onayı', '家长同意'],
  ['Без него в поиск не попасть', 'Онсыз іздеуге түспейді', 'No search listing without it', 'Onsuz aramada görünmez', '未经同意不会出现在搜索中'],
  ['Без имени', 'Есімсіз', 'No name', 'İsimsiz', '不显示姓名'],
  ['Покупатель видит класс и город', 'Сатып алушы сынып пен қаланы көреді', 'Buyers see grade and city', 'Alıcı sınıf ve şehri görür', '买方只看到年级和城市'],
  ['Контакт по запросу', 'Байланыс сұрау бойынша', 'Contact on request', 'Talep üzerine iletişim', '按请求提供联系方式'],
  ['Открывает только сам школьник', 'Тек оқушының өзі ашады', 'Only the student can share it', 'Yalnızca öğrenci paylaşabilir', '仅由学生本人开放'],
  ['Выберите роль', 'Рөлді таңдаңыз', 'Choose a role', 'Bir rol seçin', '选择角色'],
  ['Попробуйте каждую сторону', 'Әр тарапты байқап көріңіз', 'Try every side', 'Her tarafı deneyin', '体验每一方'],
  ['Выдать сертификаты призёрам за минуту', 'Жүлдегерлерге бір минутта сертификат беру', 'Issue certificates to winners in a minute', 'Kazananlara bir dakikada sertifika ver', '一分钟为获奖者颁证'],
  ['Открыть кабинет →', 'Кабинетті ашу →', 'Open dashboard →', 'Paneli aç →', '进入后台 →'],
  ['Портфолио одной ссылкой и согласие', 'Бір сілтемедегі портфолио және келісім', 'Portfolio in one link, plus consent', 'Tek bağlantıda portföy ve onay', '一个链接的作品集与授权'],
  ['Вуз или агентство', 'ЖОО немесе агенттік', 'University or agency', 'Üniversite veya ajans', '高校或机构'],
  ['Проверенные таланты из регионов', 'Өңірлерден тексерілген таланттар', 'Verified talent from the regions', 'Bölgelerden doğrulanmış yetenekler', '来自各地区的已验证人才'],
  ['Проверьте настоящий и поддельный сертификат прямо сейчас', 'Шынайы және жалған сертификатты дәл қазір тексеріңіз', 'Check a real and a fake certificate right now', 'Gerçek ve sahte sertifikayı hemen doğrulayın', '现在就验证一份真证书和一份假证书'],
  ['К проверке', 'Тексеруге', 'Go to verification', 'Doğrulamaya git', '前往验证'],
  // Проверка
  ['Для вузов, агентств и фондов', 'ЖОО, агенттіктер мен қорлар үшін', 'For universities, agencies and foundations', 'Üniversiteler, ajanslar ve vakıflar için', '面向高校、机构和基金会'],
  ['Проверка сертификата', 'Сертификатты тексеру', 'Certificate verification', 'Sertifika doğrulama', '证书验证'],
  ['Введите ID или наведите камеру на QR. Без регистрации.', 'ID енгізіңіз немесе камераны QR-ға бағыттаңыз. Тіркеусіз.', 'Enter an ID or point the camera at the QR. No sign-up.', 'ID girin veya kamerayı QR’a doğrultun. Kayıt gerekmez.', '输入 ID 或用相机扫描二维码，无需注册。'],
  ['Сканировать QR', 'QR сканерлеу', 'Scan QR', 'QR tara', '扫描二维码'],
  ['Проверить', 'Тексеру', 'Verify', 'Doğrula', '验证'],
  ['Демо:', 'Демо:', 'Demo:', 'Demo:', '演示：'],
  ['Настоящий', 'Шынайы', 'Real', 'Gerçek', '真实'],
  ['Изменён результат', 'Нәтиже өзгертілген', 'Altered result', 'Değiştirilmiş sonuç', '篡改结果'],
  ['Платный конкурс', 'Ақылы байқау', 'Paid contest', 'Ücretli yarışma', '付费比赛'],
  ['В документе указано:', 'Құжатта көрсетілген:', 'Document says:', 'Belgede yazan:', '文件上写着：'],
  ['не сверять', 'салыстырмау', 'don’t compare', 'karşılaştırma', '不比对'],
  ['Победитель', 'Жеңімпаз', 'Winner', 'Birinci', '冠军'],
  ['Призёр', 'Жүлдегер', 'Prize winner', 'Derece', '获奖者'],
  ['Финалист', 'Финалист', 'Finalist', 'Finalist', '决赛选手'],
  ['Участник', 'Қатысушы', 'Participant', 'Katılımcı', '参赛者'],
  ['Проверить →', 'Тексеру →', 'Verify →', 'Doğrula →', '验证 →'],
  ['ID, которого нет в реестре', 'Тізілімде жоқ ID', 'An ID that isn’t in the registry', 'Sicilde olmayan bir ID', '不在登记册中的 ID'],
  ['Проверяем', 'Тексеріп жатырмыз', 'Verifying', 'Doğrulanıyor', '正在验证'],
  ['Поиск в реестре', 'Тізілімнен іздеу', 'Registry lookup', 'Sicilde arama', '登记册查询'],
  ['Подпись организатора · ECDSA P-256', 'Ұйымдастырушы қолтаңбасы · ECDSA P-256', 'Organizer signature · ECDSA P-256', 'Organizatör imzası · ECDSA P-256', '主办方签名 · ECDSA P-256'],
  ['Сверка результата с подписью', 'Нәтижені қолтаңбамен салыстыру', 'Result vs. signature', 'Sonuç ve imza karşılaştırması', '结果与签名比对'],
  ['Организатор и вес конкурса', 'Ұйымдастырушы және байқау салмағы', 'Organizer and contest weight', 'Organizatör ve yarışma ağırlığı', '主办方与比赛权重'],
  ['Сертификат не найден', 'Сертификат табылмады', 'Certificate not found', 'Sertifika bulunamadı', '未找到证书'],
  ['Подлинный сертификат', 'Түпнұсқа сертификат', 'Authentic certificate', 'Gerçek sertifika', '真实证书'],
  ['Результат подделан', 'Нәтиже жалған', 'Result forged', 'Sonuç sahte', '结果被篡改'],
  ['Настоящий, но почти ничего не значит', 'Шынайы, бірақ іс жүзінде ештеңе білдірмейді', 'Real, but means almost nothing', 'Gerçek ama neredeyse değersiz', '真实，但几乎没有分量'],
  ['Детали', 'Толығырақ', 'Details', 'Ayrıntılar', '详情'],
  ['Владелец', 'Иесі', 'Holder', 'Sahibi', '持有人'],
  ['имя скрыто', 'есімі жасырын', 'name hidden', 'isim gizli', '姓名已隐藏'],
  ['Класс, город', 'Сынып, қала', 'Grade, city', 'Sınıf, şehir', '年级、城市'],
  ['Конкурс', 'Байқау', 'Contest', 'Yarışma', '比赛'],
  ['подтверждён', 'расталған', 'verified', 'doğrulandı', '已认证'],
  ['не подтверждён', 'расталмаған', 'not verified', 'doğrulanmadı', '未认证'],
  ['Баллы', 'Ұпайлар', 'Points', 'Puan', '积分'],
  ['Подпись', 'Қолтаңба', 'Signature', 'İmza', '签名'],
  ['Ключ', 'Кілт', 'Key', 'Anahtar', '密钥'],
  ['в доверенном списке', 'сенімді тізімде', 'in the trusted list', 'güvenilir listede', '在可信列表中'],
  ['ключ не в доверенном списке', 'кілт сенімді тізімде жоқ', 'key not in the trusted list', 'anahtar güvenilir listede değil', '密钥不在可信列表中'],
  ['подпись не сходится', 'қолтаңба сәйкес емес', 'signature mismatch', 'imza uyuşmuyor', '签名不匹配'],
  ['Ссылка', 'Сілтеме', 'Link', 'Bağlantı', '链接'],
  ['Печать', 'Басып шығару', 'Print', 'Yazdır', '打印'],
  ['Вес конкурса', 'Байқау салмағы', 'Contest weight', 'Yarışma ağırlığı', '比赛权重'],
  ['Что делать', 'Не істеу керек', 'What to do', 'Ne yapmalı', '怎么办'],
  ['Запросить оригинал у организатора', 'Ұйымдастырушыдан түпнұсқасын сұрау', 'Ask the organizer for the original', 'Organizatörden aslını isteyin', '向主办方索取原件'],
  ['Попросить школьника ссылку на портфолио Proofy', 'Оқушыдан Proofy портфолио сілтемесін сұрау', 'Ask the student for their Proofy portfolio link', 'Öğrenciden Proofy portföy bağlantısını isteyin', '请学生提供 Proofy 作品集链接'],
  ['Код ответа API', 'API жауап коды', 'API response code', 'API yanıt kodu', 'API 响应码'],
  ['реестр', 'тізілім', 'registry', 'sicil', '登记'],
  ['ПРОВЕРЕНО', 'ТЕКСЕРІЛДІ', 'VERIFIED', 'DOĞRULANDI', '已验证'],
  ['НЕ', 'ЖОҚ', 'NOT', 'YOK', '未'],
  ['НАЙДЕН', 'ТАБЫЛДЫ', 'FOUND', 'BULUNDU', '找到'],
  ['нет в реестре', 'тізілімде жоқ', 'not in registry', 'sicilde yok', '不在登记册'],
  ['Такой ID не выдавал ни один организатор', 'Мұндай ID-ды бірде-бір ұйымдастырушы бермеген', 'No organizer ever issued this ID', 'Bu ID’yi hiçbir organizatör vermedi', '没有任何主办方发过此 ID'],
  ['Сканер QR', 'QR сканері', 'QR scanner', 'QR tarayıcı', '二维码扫描'],
  ['Запрашиваем доступ к камере…', 'Камераға рұқсат сұралуда…', 'Requesting camera access…', 'Kamera izni isteniyor…', '正在请求相机权限…'],
  ['Демо-скан', 'Демо-скан', 'Demo scan', 'Demo tarama', '演示扫描'],
  ['Отмена', 'Болдырмау', 'Cancel', 'İptal', '取消'],
  ['Наведите камеру на QR с сертификата Proofy, например на экран телефона. Нет камеры — включите демо-скан.', 'Камераны Proofy сертификатындағы QR-ға бағыттаңыз. Камера жоқ болса — демо-сканды қосыңыз.', 'Point the camera at a Proofy QR code, e.g. on a phone screen. No camera? Use the demo scan.', 'Kamerayı Proofy QR koduna doğrultun. Kamera yoksa demo taramayı kullanın.', '将相机对准 Proofy 证书二维码。没有相机？使用演示扫描。'],
  ['Ищем QR…', 'QR іздеп жатырмыз…', 'Looking for a QR…', 'QR aranıyor…', '正在寻找二维码…'],
  ['QR распознан', 'QR танылды', 'QR recognized', 'QR tanındı', '已识别二维码'],
  // Рейтинг
  ['Открыто для всех', 'Барлығына ашық', 'Open to everyone', 'Herkese açık', '向所有人开放'],
  ['Рейтинг конкурсов', 'Байқаулар рейтингі', 'Contest ranking', 'Yarışma sıralaması', '比赛排行'],
  ['Сколько на самом деле весит грамота. Без регистрации.', 'Грамотаның шынайы салмағы. Тіркеусіз.', 'What a diploma is really worth. No sign-up.', 'Bir diplomanın gerçek değeri. Kayıt gerekmez.', '奖状的真实分量，无需注册。'],
  ['Все направления', 'Барлық бағыттар', 'All fields', 'Tüm alanlar', '全部方向'],
  ['Математика', 'Математика', 'Math', 'Matematik', '数学'],
  ['Робототехника', 'Робототехника', 'Robotics', 'Robotik', '机器人'],
  ['Физика', 'Физика', 'Physics', 'Fizik', '物理'],
  ['организатор подтверждён', 'ұйымдастырушы расталған', 'organizer verified', 'organizatör doğrulandı', '主办方已认证'],
  ['организатор не подтверждён', 'ұйымдастырушы расталмаған', 'organizer not verified', 'organizatör doğrulanmadı', '主办方未认证'],
  ['платно без отбора', 'іріктеусіз ақылы', 'paid, no selection', 'ücretli, elemesiz', '付费无选拔'],
  ['Почему так ▾', 'Неге солай ▾', 'Why ▾', 'Neden ▾', '原因 ▾'],
  ['вес', 'салмақ', 'weight', 'ağırlık', '权重'],
  // Организатор
  ['Источник доверия', 'Сенім көзі', 'Source of trust', 'Güven kaynağı', '信任来源'],
  ['Кабинет организатора', 'Ұйымдастырушы кабинеті', 'Organizer dashboard', 'Organizatör paneli', '主办方后台'],
  ['Выдавайте сертификаты, которые нельзя подделать. Бесплатно.', 'Жалғандауға болмайтын сертификаттар беріңіз. Тегін.', 'Issue certificates that can’t be faked. For free.', 'Sahtesi yapılamayan sertifikalar verin. Ücretsiz.', '颁发无法伪造的证书，完全免费。'],
  ['конкурсов', 'байқау', 'contests', 'yarışma', '个比赛'],
  ['сертификатов выдано', 'сертификат берілді', 'certificates issued', 'sertifika verildi', '份证书已颁发'],
  ['Новый конкурс', 'Жаңа байқау', 'New contest', 'Yeni yarışma', '新建比赛'],
  ['Название', 'Атауы', 'Name', 'Ad', '名称'],
  ['Направление', 'Бағыт', 'Field', 'Alan', '方向'],
  ['Участников', 'Қатысушылар', 'Participants', 'Katılımcı', '参赛人数'],
  ['Наградили, %', 'Марапатталды, %', 'Awarded, %', 'Ödül alan, %', '获奖比例 %'],
  ['Дата', 'Күні', 'Date', 'Tarih', '日期'],
  ['Не все проходят в финал', 'Финалға бәрі өтпейді', 'Not everyone reaches the final', 'Herkes finale kalmaz', '并非人人进决赛'],
  ['Взнос за участие или диплом', 'Қатысу немесе диплом үшін жарна', 'Fee for entry or diploma', 'Katılım veya diploma ücreti', '参赛或证书收费'],
  ['Вес конкурса считается сразу', 'Байқау салмағы бірден есептеледі', 'Weight is calculated instantly', 'Ağırlık anında hesaplanır', '权重即时计算'],
  ['Создать конкурс', 'Байқау құру', 'Create contest', 'Yarışma oluştur', '创建比赛'],
  ['Выдать →', 'Беру →', 'Issue →', 'Ver →', '颁发 →'],
  ['← Все конкурсы', '← Барлық байқаулар', '← All contests', '← Tüm yarışmalar', '← 全部比赛'],
  ['Выдать сертификаты', 'Сертификат беру', 'Issue certificates', 'Sertifika ver', '颁发证书'],
  ['Вставить пример', 'Мысал қою', 'Insert example', 'Örnek ekle', '插入示例'],
  ['Шаблон CSV', 'CSV үлгісі', 'CSV template', 'CSV şablonu', 'CSV 模板'],
  ['Почему такой вес', 'Неге мұндай салмақ', 'Why this weight', 'Neden bu ağırlık', '权重说明'],
  ['Новые профили создаются скрытыми: школьник сам решает, кто их увидит.', 'Жаңа профильдер жасырын жасалады: кім көретінін оқушы өзі шешеді.', 'New profiles start hidden: the student decides who sees them.', 'Yeni profiller gizli başlar: kimin göreceğine öğrenci karar verir.', '新档案默认隐藏，由学生决定谁能看到。'],
  ['QR ведёт на страницу проверки', 'QR тексеру бетіне апарады', 'The QR opens the verification page', 'QR doğrulama sayfasını açar', '二维码指向验证页'],
  ['Результат', 'Нәтиже', 'Result', 'Sonuç', '结果'],
  ['Подписываем…', 'Қол қойып жатырмыз…', 'Signing…', 'İmzalanıyor…', '正在签名…'],
  // Школьник
  ['Тестовый аккаунт', 'Тестілік аккаунт', 'Test account', 'Test hesabı', '测试账号'],
  ['Кабинет школьника', 'Оқушы кабинеті', 'Student dashboard', 'Öğrenci paneli', '学生后台'],
  ['Достижения добавляет только организатор. Вы решаете, кто их видит.', 'Жетістіктерді тек ұйымдастырушы қосады. Кім көретінін сіз шешесіз.', 'Only organizers add achievements. You decide who sees them.', 'Başarıları yalnızca organizatör ekler. Kimin göreceğine siz karar verirsiniz.', '成就只能由主办方添加，由你决定谁可见。'],
  ['Мои сертификаты', 'Менің сертификаттарым', 'My certificates', 'Sertifikalarım', '我的证书'],
  ['Запросы', 'Сұраулар', 'Requests', 'Talepler', '请求'],
  ['Открыть контакт', 'Байланысты ашу', 'Share contact', 'İletişimi paylaş', '开放联系方式'],
  ['Отклонить', 'Бас тарту', 'Decline', 'Reddet', '拒绝'],
  ['контакт открыт', 'байланыс ашық', 'contact shared', 'iletişim paylaşıldı', '已开放联系方式'],
  ['отклонён', 'қабылданбады', 'declined', 'reddedildi', '已拒绝'],
  ['Согласие', 'Келісім', 'Consent', 'Onay', '授权'],
  ['В рабочей версии — SMS-код родителю', 'Жұмыс нұсқасында — ата-анаға SMS-код', 'In production: an SMS code to the parent', 'Gerçek sürümde veliye SMS kodu', '正式版中向家长发送短信验证码'],
  ['Показывать в поиске', 'Іздеуде көрсету', 'Show in search', 'Aramada göster', '在搜索中显示'],
  ['Без имени: класс, город, достижения', 'Есімсіз: сынып, қала, жетістіктер', 'No name: grade, city, achievements', 'İsimsiz: sınıf, şehir, başarılar', '不显示姓名：年级、城市、成就'],
  ['Показывать имя', 'Есімді көрсету', 'Show name', 'İsmi göster', '显示姓名'],
  ['Иначе видны только инициалы', 'Әйтпесе тек инициалдар көрінеді', 'Otherwise only initials are shown', 'Aksi halde yalnızca baş harfler görünür', '否则仅显示首字母'],
  ['Публичное портфолио', 'Ашық портфолио', 'Public portfolio', 'Herkese açık portföy', '公开作品集'],
  ['Ссылка для заявок на гранты', 'Грант өтінімдеріне сілтеме', 'A link for grant applications', 'Burs başvuruları için bağlantı', '用于申请奖学金的链接'],
  ['Так вас видит вуз', 'ЖОО сізді осылай көреді', 'How universities see you', 'Üniversiteler sizi böyle görür', '高校看到的你'],
  ['Полезно уже сейчас', 'Қазірдің өзінде пайдалы', 'Useful right now', 'Şimdiden faydalı', '现在就有用'],
  ['Моё портфолио', 'Менің портфолиом', 'My portfolio', 'Portföyüm', '我的作品集'],
  ['Копировать ссылку', 'Сілтемені көшіру', 'Copy link', 'Bağlantıyı kopyala', '复制链接'],
  ['в поиске', 'іздеуде', 'in search', 'aramada', '可被搜索'],
  ['скрыт', 'жасырын', 'hidden', 'gizli', '已隐藏'],
  ['баллов', 'ұпай', 'points', 'puan', '分'],
  ['Вас нет в поиске. Вуз может только проверить сертификат по ID.', 'Сіз іздеуде жоқсыз. ЖОО тек ID бойынша сертификатты тексере алады.', 'You are not in search. A university can only verify a certificate by ID.', 'Aramada değilsiniz. Üniversite yalnızca ID ile doğrulayabilir.', '你不在搜索结果中，高校只能通过 ID 验证证书。'],
  // Покупатель
  ['Таланты из регионов', 'Өңірлерден шыққан таланттар', 'Talent from the regions', 'Bölgelerden yetenekler', '来自各地区的人才'],
  ['Только проверенные достижения и только с согласия школьника.', 'Тек тексерілген жетістіктер және тек оқушының келісімімен.', 'Only verified achievements, only with the student’s consent.', 'Yalnızca doğrulanmış başarılar, yalnızca öğrencinin onayıyla.', '仅限已验证成就，且须经学生同意。'],
  ['открыты для поиска', 'іздеуге ашық', 'open to search', 'aramaya açık', '可被搜索'],
  ['из малых городов', 'шағын қалалардан', 'from small towns', 'küçük şehirlerden', '来自小城镇'],
  ['контактов открыто', 'байланыс ашылды', 'contacts shared', 'iletişim paylaşıldı', '已开放联系方式'],
  ['скрыты без согласия', 'келісімсіз жасырын', 'hidden without consent', 'onaysız gizli', '未同意而隐藏'],
  ['Поиск', 'Іздеу', 'Search', 'Arama', '搜索'],
  ['Город', 'Қала', 'City', 'Şehir', '城市'],
  ['Все', 'Барлығы', 'All', 'Tümü', '全部'],
  ['Вес лучшего конкурса', 'Үздік байқау салмағы', 'Best contest weight', 'En iyi yarışma ağırlığı', '最佳比赛权重'],
  ['Любой', 'Кез келген', 'Any', 'Herhangi', '不限'],
  ['Сортировка по баллам', 'Ұпай бойынша сұрыптау', 'Sorted by points', 'Puana göre sıralı', '按积分排序'],
  ['Запросить контакт', 'Байланыс сұрау', 'Request contact', 'İletişim iste', '请求联系方式'],
  ['Имя и контакт откроются после согласия школьника', 'Есім мен байланыс оқушы келіскен соң ашылады', 'Name and contact unlock after the student agrees', 'İsim ve iletişim öğrenci onaylayınca açılır', '学生同意后才显示姓名和联系方式'],
  ['Запрос отправлен. Ждём ответа школьника.', 'Сұрау жіберілді. Оқушының жауабын күтеміз.', 'Request sent. Waiting for the student.', 'Talep gönderildi. Öğrencinin yanıtı bekleniyor.', '请求已发送，等待学生回复。'],
  ['Грант на обучение', 'Оқу гранты', 'Study grant', 'Eğitim bursu', '助学金'],
  ['Стажировка', 'Тағылымдама', 'Internship', 'Staj', '实习'],
  ['Консультация по поступлению', 'Түсу бойынша кеңес', 'Admissions consultation', 'Kabul danışmanlığı', '升学咨询'],
  ['Летняя школа', 'Жазғы мектеп', 'Summer school', 'Yaz okulu', '夏令营'],
  ['Покупатель', 'Сатып алушы', 'Buyer', 'Alıcı', '买方'],
  ['Цель', 'Мақсат', 'Purpose', 'Amaç', '目的'],
  ['Статус', 'Мәртебе', 'Status', 'Durum', '状态'],
  ['ждёт ответа', 'жауап күтуде', 'awaiting reply', 'yanıt bekleniyor', '等待回复'],
  ['Проверить сертификат', 'Сертификатты тексеру', 'Verify a certificate', 'Sertifika doğrula', '验证证书'],
  ['Образовательное агентство', 'Білім беру агенттігі', 'Education agency', 'Eğitim ajansı', '教育机构'],
  ['Вуз', 'ЖОО', 'University', 'Üniversite', '高校'],
  // API
  ['Для партнёров', 'Серіктестер үшін', 'For partners', 'Ortaklar için', '面向合作伙伴'],
  ['работает', 'жұмыс істейді', 'operational', 'çalışıyor', '运行中'],
  ['запросов за сессию', 'сессиядағы сұрау', 'requests this session', 'oturumdaki istek', '本次会话请求数'],
  ['средняя задержка, мс', 'орташа кідіріс, мс', 'average latency, ms', 'ortalama gecikme, ms', '平均延迟（毫秒）'],
  ['подпись P-256 на каждом сертификате', 'әр сертификатта P-256 қолтаңбасы', 'P-256 signature on every certificate', 'her sertifikada P-256 imzası', '每份证书均有 P-256 签名'],
  ['JSON, ключ партнёра', 'JSON, серіктес кілті', 'JSON, partner key', 'JSON, ortak anahtarı', 'JSON，合作方密钥'],
  ['Эндпоинты', 'Эндпоинттер', 'Endpoints', 'Uç noktalar', '接口'],
  ['Пример: проверка сертификата', 'Мысал: сертификатты тексеру', 'Example: verify a certificate', 'Örnek: sertifika doğrulama', '示例：验证证书'],
  ['Журнал запросов', 'Сұраулар журналы', 'Request log', 'İstek günlüğü', '请求日志'],
  ['Сделать запрос', 'Сұрау жасау', 'Make a request', 'İstek gönder', '发起请求'],
  ['Время', 'Уақыт', 'Time', 'Zaman', '时间'],
  ['Метод', 'Әдіс', 'Method', 'Yöntem', '方法'],
  ['Путь', 'Жол', 'Path', 'Yol', '路径'],
  ['Код', 'Код', 'Code', 'Kod', '状态码'],
  ['Задержка', 'Кідіріс', 'Latency', 'Gecikme', '延迟'],
  ['Открытые ключи организаторов', 'Ұйымдастырушылардың ашық кілттері', 'Organizers’ public keys', 'Organizatörlerin açık anahtarları', '主办方公钥'],
  ['доверенный', 'сенімді', 'trusted', 'güvenilir', '可信'],
  ['не доверенный', 'сенімсіз', 'not trusted', 'güvenilmez', '不可信'],
  // Набор
  ['Для питча', 'Питч үшін', 'For the pitch', 'Sunum için', '用于路演'],
  ['Набор для живого демо', 'Тікелей демоға арналған жинақ', 'Live demo kit', 'Canlı demo seti', '现场演示套件'],
  ['Распечатать набор', 'Жинақты басып шығару', 'Print the kit', 'Seti yazdır', '打印套件'],
  // Тур
  ['Далее', 'Әрі қарай', 'Next', 'İleri', '下一步'],
  ['Готово', 'Дайын', 'Done', 'Tamam', '完成'],
  ['Разделы всегда под рукой', 'Бөлімдер әрқашан қол астында', 'Sections are always at hand', 'Bölümler her zaman elinizin altında', '栏目随时可达'],
  ['Меню остаётся наверху при прокрутке. На телефоне — панель внизу.', 'Айналдырғанда мәзір жоғарыда қалады. Телефонда — төменгі панель.', 'The menu stays on top while scrolling. On phones it’s the bottom bar.', 'Menü kaydırırken üstte kalır. Telefonda alt çubuktadır.', '滚动时菜单固定在顶部，手机上在底部。'],
  ['Проверка за 5 секунд', '5 секундта тексеру', 'Verification in 5 seconds', '5 saniyede doğrulama', '5 秒验证'],
  ['Введите ID или отсканируйте QR. Есть демо: настоящий, подделка, изменённый результат.', 'ID енгізіңіз немесе QR сканерлеңіз. Демо бар: шынайы, жалған, өзгертілген нәтиже.', 'Enter an ID or scan a QR. Demos: real, fake, altered result.', 'ID girin veya QR tarayın. Demolar: gerçek, sahte, değiştirilmiş sonuç.', '输入 ID 或扫描二维码。演示：真实、伪造、篡改。'],
  ['Вес грамоты', 'Грамота салмағы', 'Diploma weight', 'Diploma ağırlığı', '奖状权重'],
  ['Двигайте ползунки и сравните областную олимпиаду с платной «международной».', 'Жүгірткілерді жылжытып, облыстық олимпиаданы ақылы «халықаралықпен» салыстырыңыз.', 'Move the sliders and compare a regional olympiad with a paid “international” one.', 'Kaydırıcılarla bölgesel olimpiyatı ücretli “uluslararası” ile karşılaştırın.', '拖动滑块，比较州级奥赛和付费“国际赛”。'],
  ['Язык и навигация', 'Тіл және навигация', 'Language and navigation', 'Dil ve gezinme', '语言与导航'],
  ['Пять языков. Справа — точки для быстрого перехода по разделам страницы.', 'Бес тіл. Оң жақта — бет бөлімдеріне жылдам өтуге арналған нүктелер.', 'Five languages. Dots on the right jump between page sections.', 'Beş dil. Sağdaki noktalar sayfa bölümleri arasında geçiş yapar.', '五种语言。右侧圆点可快速跳转页面各部分。'],
  // Тосты
  ['Скопировано', 'Көшірілді', 'Copied', 'Kopyalandı', '已复制'],
  ['Запрос отправлен школьнику', 'Сұрау оқушыға жіберілді', 'Request sent to the student', 'Talep öğrenciye gönderildi', '请求已发送给学生'],
  ['Контакт открыт', 'Байланыс ашылды', 'Contact shared', 'İletişim paylaşıldı', '已开放联系方式'],
  ['Запрос отклонён', 'Сұрау қабылданбады', 'Request declined', 'Talep reddedildi', '请求已拒绝'],
  ['Согласие сохранено', 'Келісім сақталды', 'Consent saved', 'Onay kaydedildi', '授权已保存'],
  ['Доступ закрыт', 'Қолжетімділік жабылды', 'Access closed', 'Erişim kapatıldı', '已关闭访问'],
  ['Конкурс создан', 'Байқау құрылды', 'Contest created', 'Yarışma oluşturuldu', '比赛已创建'],
  ['Демо-данные сброшены', 'Демо-деректер тасталды', 'Demo data reset', 'Demo verileri sıfırlandı', '演示数据已重置'],
  ['Шаблон скачан', 'Үлгі жүктелді', 'Template downloaded', 'Şablon indirildi', '模板已下载'],
  ['Язык', 'Тіл', 'Language', 'Dil', '语言'],
  // Данные: организаторы, конкурсы, покупатели
  ['Управление образования области (тест)', 'Облыстық білім басқармасы (тест)', 'Regional Education Department (test)', 'Bölge Eğitim Müdürlüğü (test)', '州教育局（测试）'],
  ['Республиканский центр олимпиад (тест)', 'Республикалық олимпиадалар орталығы (тест)', 'National Olympiad Center (test)', 'Ulusal Olimpiyat Merkezi (test)', '国家奥赛中心（测试）'],
  ['Star Olympiad International (онлайн)', 'Star Olympiad International (онлайн)', 'Star Olympiad International (online)', 'Star Olympiad International (çevrimiçi)', 'Star Olympiad International（线上）'],
  ['Областная олимпиада по математике', 'Математикадан облыстық олимпиада', 'Regional Math Olympiad', 'Bölgesel Matematik Olimpiyatı', '州级数学奥赛'],
  ['Республиканская олимпиада по информатике', 'Информатикадан республикалық олимпиада', 'National Informatics Olympiad', 'Ulusal Bilişim Olimpiyatı', '全国信息学奥赛'],
  ['Star Olympiad — математика', 'Star Olympiad — математика', 'Star Olympiad — Math', 'Star Olympiad — Matematik', 'Star Olympiad — 数学'],
  ['Областной турнир по робототехнике FTC', 'Робототехникадан облыстық FTC турнирі', 'Regional FTC Robotics Tournament', 'Bölgesel FTC Robotik Turnuvası', '州级 FTC 机器人赛'],
  ['Агентство «Bilim Path» (тест)', '«Bilim Path» агенттігі (тест)', 'Bilim Path agency (test)', 'Bilim Path ajansı (test)', 'Bilim Path 机构（测试）'],
  ['Приёмная комиссия, региональный вуз (тест)', 'Қабылдау комиссиясы, өңірлік ЖОО (тест)', 'Admissions, regional university (test)', 'Kabul ofisi, bölge üniversitesi (test)', '地区高校招生办（测试）'],
  ['Школьные олимпиады', 'Мектеп олимпиадалары', 'School olympiads', 'Okul olimpiyatları', '校级奥赛'],
  ['Городские конкурсы', 'Қалалық байқаулар', 'City contests', 'Şehir yarışmaları', '市级比赛'],
  ['Турниры FTC', 'FTC турнирлері', 'FTC tournaments', 'FTC turnuvaları', 'FTC 赛事'],
  ['Международная олимпиада', 'Халықаралық олимпиада', 'International olympiad', 'Uluslararası olimpiyat', '国际奥赛'],
  ['Школа-гимназия №1', '№1 мектеп-гимназия', 'School-Gymnasium No. 1', '1 No’lu Okul-Gimnazyum', '第一中学'],
  // Страница API, набор, рейтинг
  ['Проверка встраивается в CRM агентства или приёмной комиссии. Ниже живой журнал запросов этой сессии.', 'Тексеру агенттік немесе қабылдау комиссиясының CRM жүйесіне енгізіледі. Төменде осы сессияның сұраулар журналы.', 'Verification plugs into an agency’s or admissions office’s CRM. Below is a live log of this session’s requests.', 'Doğrulama ajans veya kabul ofisi CRM’ine entegre olur. Aşağıda bu oturumun canlı istek günlüğü var.', '验证可接入机构或招生办的 CRM。下方为本次会话的实时请求日志。'],
  ['проверка', 'тексеру', 'verify', 'doğrulama', '验证'],
  ['выдача', 'беру', 'issue', 'verme', '颁发'],
  ['новый конкурс', 'жаңа байқау', 'new contest', 'yeni yarışma', '新建比赛'],
  ['поиск', 'іздеу', 'search', 'arama', '搜索'],
  ['запрос контакта', 'байланыс сұрау', 'contact request', 'iletişim talebi', '联系请求'],
  ['согласие', 'келісім', 'consent', 'onay', '授权'],
  ['открытый ключ', 'ашық кілт', 'public key', 'açık anahtar', '公钥'],
  ['Любой может проверить подпись сертификата этим ключом, даже без нашего сервера.', 'Кез келген адам сертификат қолтаңбасын осы кілтпен біздің серверсіз де тексере алады.', 'Anyone can verify a certificate signature with this key, even without our server.', 'Herkes bu anahtarla imzayı sunucumuz olmadan da doğrulayabilir.', '任何人都可以用此公钥验证证书签名，无需我们的服务器。'],
  ['Адрес api.proofy.kz — пример для рабочей версии. В прототипе запросы обрабатываются в браузере.', 'api.proofy.kz мекенжайы — жұмыс нұсқасына мысал. Прототипте сұраулар браузерде өңделеді.', 'api.proofy.kz is an example for production. In the prototype, requests run in the browser.', 'api.proofy.kz canlı sürüm için örnektir. Prototipte istekler tarayıcıda işlenir.', 'api.proofy.kz 为正式版示例地址，原型中的请求在浏览器内处理。'],
  ['Распечатайте три карточки. Жюри сканирует QR своим телефоном и видит три разных исхода.', 'Үш карточканы басып шығарыңыз. Қазылар QR-ды телефонымен сканерлеп, үш түрлі нәтижені көреді.', 'Print three cards. The jury scans each QR with their own phone and sees three outcomes.', 'Üç kartı yazdırın. Jüri QR’ları kendi telefonuyla tarar ve üç sonucu görür.', '打印三张卡片，评委用自己的手机扫码，看到三种结果。'],
  ['настоящий', 'шынайы', 'real', 'gerçek', '真实'],
  ['Подправлен', 'Түзетілген', 'Altered', 'Değiştirilmiş', '已篡改'],
  ['результат подправлен', 'нәтиже түзетілген', 'result altered', 'sonuç değiştirilmiş', '结果被改动'],
  ['ID выдуман', 'ID ойдан шығарылған', 'made-up ID', 'uydurma ID', '伪造的 ID'],
  ['Сканирование покажет: «Подлинный сертификат».', 'Сканерлеу көрсетеді: «Түпнұсқа сертификат».', 'Scanning shows: “Authentic certificate”.', 'Tarama gösterir: “Gerçek sertifika”.', '扫描结果：“真实证书”。'],
  ['На бумаге «Победитель», а реестр скажет «Участник».', 'Қағазда «Жеңімпаз», ал тізілім «Қатысушы» дейді.', 'Paper says “Winner”, the registry says “Participant”.', 'Kağıtta “Birinci”, sicil “Katılımcı” der.', '纸上写“冠军”，登记册显示“参赛者”。'],
  ['Такого ID нет в реестре: «Сертификат не найден».', 'Мұндай ID тізілімде жоқ: «Сертификат табылмады».', 'This ID isn’t in the registry: “Certificate not found”.', 'Bu ID sicilde yok: “Sertifika bulunamadı”.', '登记册中无此 ID：“未找到证书”。'],
  ['Сертификаты, выданные во время питча с ноутбука, хранятся только в его браузере. На телефоне жюри их не будет, поэтому для сканирования используйте эти три карточки.', 'Питч кезінде ноутбуктан берілген сертификаттар тек оның браузерінде сақталады. Қазылардың телефонында олар болмайды, сондықтан сканерлеуге осы үш карточканы қолданыңыз.', 'Certificates issued from the laptop during the pitch live only in its browser. The jury’s phones won’t have them, so use these three cards for scanning.', 'Sunum sırasında dizüstünden verilen sertifikalar yalnızca o tarayıcıda kalır. Jürinin telefonunda olmaz; taramak için bu üç kartı kullanın.', '路演时用笔记本颁发的证书只存在该浏览器中，评委手机上没有，请用这三张卡片扫码。'],
  ['Формула открыта: уровень + размер + отбор − неподтверждённый организатор − платно без отбора − массовое награждение. Подробнее — на главной в блоке «Сколько весит грамота?».', 'Формула ашық: деңгей + көлем + іріктеу − расталмаған ұйымдастырушы − іріктеусіз ақылы − жаппай марапаттау. Толығырақ — басты беттегі «Грамотаның салмағы қанша?» блогында.', 'The formula is open: level + size + selection − unverified organizer − paid without selection − mass awards. Details in “How much is a diploma worth?” on the home page.', 'Formül açık: seviye + büyüklük + eleme − doğrulanmamış organizatör − elemesiz ücretli − toplu ödül. Ayrıntılar ana sayfada.', '公式公开：级别 + 规模 + 选拔 − 未认证主办方 − 付费无选拔 − 大面积颁奖。详见首页“一张奖状值多少？”。'],
  ['Одна строка — один школьник:', 'Бір жол — бір оқушы:', 'One line per student:', 'Her satır bir öğrenci:', '每行一名学生：'],
  ['ФИО; класс; город; школа; результат', 'Аты-жөні; сынып; қала; мектеп; нәтиже', 'Name; grade; city; school; result', 'Ad; sınıf; şehir; okul; sonuç', '姓名；年级；城市；学校；结果'],
  ['Отправляем…', 'Жіберіп жатырмыз…', 'Sending…', 'Gönderiliyor…', '发送中…'],
  // Резюме
  ['Резюме скрыто', 'Түйіндеме жасырын', 'Resume hidden', 'Özgeçmiş gizli', '简历已隐藏'],
  ['Владелец не открыл публичную ссылку.', 'Иесі ашық сілтемені ашпаған.', 'The owner hasn’t made the link public.', 'Sahibi bağlantıyı herkese açmadı.', '所有者未公开链接。'],
  ['Школьник не дал согласия на показ в поиске.', 'Оқушы іздеуде көрсетуге келісім бермеген.', 'The student hasn’t agreed to appear in search.', 'Öğrenci aramada görünmeyi onaylamadı.', '该学生未同意出现在搜索中。'],
  ['← К талантам', '← Таланттарға', '← Back to talent', '← Yeteneklere dön', '← 返回人才列表'],
  ['← На главную', '← Басты бетке', '← Home', '← Ana sayfa', '← 返回首页'],
  ['Резюме таланта', 'Талант түйіндемесі', 'Talent resume', 'Yetenek özgeçmişi', '人才简历'],
  ['О себе', 'Өзім туралы', 'About', 'Hakkında', '个人简介'],
  ['Навыки', 'Дағдылар', 'Skills', 'Beceriler', '技能'],
  ['Проекты', 'Жобалар', 'Projects', 'Projeler', '项目'],
  ['Подтверждённые достижения', 'Расталған жетістіктер', 'Verified achievements', 'Doğrulanmış başarılar', '已验证成就'],
  ['Пока нет подтверждённых достижений.', 'Әзірге расталған жетістіктер жоқ.', 'No verified achievements yet.', 'Henüz doğrulanmış başarı yok.', '暂无已验证成就。'],
  ['Связаться', 'Байланысу', 'Get in touch', 'İletişime geç', '联系'],
  ['Коротко', 'Қысқаша', 'At a glance', 'Özet', '概览'],
  ['Класс', 'Сынып', 'Grade', 'Sınıf', '年级'],
  ['Каждое достижение выдано организатором конкурса и подписано его ключом. Школьник сам не может их добавить.', 'Әр жетістікті байқау ұйымдастырушысы беріп, өз кілтімен қол қойған. Оқушы оларды өзі қоса алмайды.', 'Every achievement is issued and signed by the contest organizer. Students can’t add them themselves.', 'Her başarı organizatör tarafından verilip imzalanır. Öğrenci kendisi ekleyemez.', '每项成就均由比赛主办方颁发并签名，学生无法自行添加。'],
  ['Открыть резюме', 'Түйіндемені ашу', 'Open resume', 'Özgeçmişi aç', '查看简历'],
  ['Контакт:', 'Байланыс:', 'Contact:', 'İletişim:', '联系方式：'],
  ['Моё резюме', 'Менің түйіндемем', 'My resume', 'Özgeçmişim', '我的简历'],
  ['Кто я в одной фразе', 'Мен кіммін — бір сөйлеммен', 'Who I am in one line', 'Tek cümlede ben', '一句话介绍自己'],
  ['Чем я известен', 'Немен танымалмын', 'What I’m known for', 'Neyle tanınıyorum', '我的代表成绩'],
  ['Навыки через запятую', 'Дағдылар үтір арқылы', 'Skills, comma-separated', 'Beceriler, virgülle', '技能（用逗号分隔）'],
  ['Сохранить', 'Сақтау', 'Save', 'Kaydet', '保存'],
  ['Посмотреть резюме', 'Түйіндемені көру', 'View resume', 'Özgeçmişi gör', '查看简历'],
  ['Резюме сохранено', 'Түйіндеме сақталды', 'Resume saved', 'Özgeçmiş kaydedildi', '简历已保存'],
  ['Пишу на Python и делаю ботов', 'Python-да жазып, бот жасаймын', 'I code in Python and build bots', 'Python ile kod yazıp bot yapıyorum', '我用 Python 写机器人'],
  ['Победил на хакатоне', 'Хакатонда жеңдім', 'Won a hackathon', 'Hackathon kazandım', '赢得黑客松'],
  ['Python, Figma', 'Python, Figma', 'Python, Figma', 'Python, Figma', 'Python, Figma'],
  // Профили тестовых школьников
  ['Пишет на Python и делает Telegram-ботов', 'Python-да жазып, Telegram-боттар жасайды', 'Codes in Python and builds Telegram bots', 'Python ile kod yazıp Telegram botları yapıyor', '用 Python 开发 Telegram 机器人'],
  ['Победила на Gambit Hackathon 2026', 'Gambit Hackathon 2026-да жеңді', 'Won Gambit Hackathon 2026', 'Gambit Hackathon 2026’yı kazandı', 'Gambit Hackathon 2026 冠军'],
  ['Сделала бота школьного расписания, им пользуются 600 учеников. Хочет учиться на программиста.', 'Мектеп кестесінің ботын жасады, оны 600 оқушы пайдаланады. Бағдарламашы болып оқығысы келеді.', 'Built a school timetable bot used by 600 students. Wants to study software engineering.', '600 öğrencinin kullandığı okul ders programı botunu yaptı. Yazılım okumak istiyor.', '开发了学校课表机器人，600 名学生在用。希望学习软件工程。'],
  ['Telegram-боты', 'Telegram-боттар', 'Telegram bots', 'Telegram botları', 'Telegram 机器人'],
  ['Бот расписания', 'Кесте боты', 'Timetable bot', 'Ders programı botu', '课表机器人'],
  ['Telegram-бот для 600 учеников школы', 'Мектептің 600 оқушысына арналған Telegram-бот', 'Telegram bot for 600 students', '600 öğrenci için Telegram botu', '服务 600 名学生的 Telegram 机器人'],
  ['Капитан команды по робототехнике', 'Робототехника командасының капитаны', 'Robotics team captain', 'Robotik takım kaptanı', '机器人队队长'],
  ['Привёл команду к победе на областном турнире FTC', 'Команданы облыстық FTC турнирінде жеңіске жеткізді', 'Led the team to victory at the regional FTC tournament', 'Takımını bölgesel FTC turnuvasında zafere taşıdı', '带领团队赢得州级 FTC 赛'],
  ['Собирает роботов с 8 класса и учит младших программировать на C++.', '8-сыныптан бері робот құрастырады және кішілерге C++ үйретеді.', 'Has built robots since 8th grade and teaches younger students C++.', '8. sınıftan beri robot yapıyor ve küçüklere C++ öğretiyor.', '从八年级起制作机器人，并教低年级学生 C++。'],
  ['Робот-сортировщик', 'Сұрыптаушы робот', 'Sorting robot', 'Ayıklayıcı robot', '分拣机器人'],
  ['Робот для турнира FTC, собран за 6 недель', 'FTC турниріне арналған робот, 6 аптада құрастырылды', 'An FTC robot built in 6 weeks', '6 haftada yapılan FTC robotu', '6 周完成的 FTC 机器人'],
  ['Олимпиадная математика', 'Олимпиадалық математика', 'Olympiad math', 'Olimpiyat matematiği', '奥赛数学'],
  ['Победительница областной олимпиады по математике', 'Математикадан облыстық олимпиаданың жеңімпазы', 'Winner of the regional math olympiad', 'Bölgesel matematik olimpiyatı birincisi', '州级数学奥赛冠军'],
  ['Решает задачи по комбинаторике и бесплатно ведёт кружок для младших.', 'Комбинаторика есептерін шығарады және кішілерге тегін үйірме жүргізеді.', 'Solves combinatorics problems and runs a free club for younger students.', 'Kombinatorik problemleri çözüyor ve küçükler için ücretsiz kulüp yürütüyor.', '钻研组合数学，并为低年级学生免费开设兴趣班。'],
  ['Комбинаторика', 'Комбинаторика', 'Combinatorics', 'Kombinatorik', '组合数学'],
  ['Геометрия', 'Геометрия', 'Geometry', 'Geometri', '几何'],
  ['Теория чисел', 'Сандар теориясы', 'Number theory', 'Sayılar teorisi', '数论'],
  ['Кружок для младших', 'Кішілерге арналған үйірме', 'Club for younger students', 'Küçükler için kulüp', '低年级兴趣班'],
  ['Занятия для учеников 5–7 классов', '5–7-сынып оқушыларына сабақтар', 'Classes for grades 5–7', '5–7. sınıflar için dersler', '面向 5–7 年级的课程'],
  ['Спортивное программирование', 'Спорттық бағдарламалау', 'Competitive programming', 'Yarışmacı programlama', '算法竞赛'],
  ['Победитель республиканской олимпиады по информатике', 'Информатикадан республикалық олимпиаданың жеңімпазы', 'Winner of the national informatics olympiad', 'Ulusal bilişim olimpiyatı birincisi', '全国信息学奥赛冠军'],
  ['Готовится к международной олимпиаде.', 'Халықаралық олимпиадаға дайындалуда.', 'Preparing for the international olympiad.', 'Uluslararası olimpiyata hazırlanıyor.', '正在备战国际奥赛。'],
  ['Алгоритмы', 'Алгоритмдер', 'Algorithms', 'Algoritmalar', '算法'],
  ['Инженер-конструктор', 'Инженер-конструктор', 'Design engineer', 'Tasarım mühendisi', '设计工程师'],
  ['Призёр областного турнира FTC', 'Облыстық FTC турнирінің жүлдегері', 'Prize winner at the regional FTC tournament', 'Bölgesel FTC turnuvasında derece', '州级 FTC 赛获奖者'],
  ['Проектирует детали в CAD и печатает их на 3D-принтере.', 'CAD-та бөлшектерді жобалап, 3D-принтерде басып шығарады.', 'Designs parts in CAD and 3D-prints them.', 'CAD’de parça tasarlayıp 3D yazıcıda basıyor.', '用 CAD 设计零件并 3D 打印。'],
  ['3D-печать', '3D-басып шығару', '3D printing', '3D baskı', '3D 打印'],
  ['Электроника', 'Электроника', 'Electronics', 'Elektronik', '电子'],
  ['Протез-манипулятор', 'Протез-манипулятор', 'Prosthetic gripper', 'Protez kavrayıcı', '假肢机械手'],
  ['Прототип кисти руки из 3D-печати', '3D-басып шығарудан жасалған қол прототипі', 'A 3D-printed hand prototype', '3D baskı el prototipi', '3D 打印的手部原型'],
  ['Любит алгебру', 'Алгебраны жақсы көреді', 'Loves algebra', 'Cebiri seviyor', '热爱代数'],
  ['Участник областной олимпиады по математике', 'Математикадан облыстық олимпиаданың қатысушысы', 'Participant of the regional math olympiad', 'Bölgesel matematik olimpiyatı katılımcısı', '州级数学奥赛参赛者'],
  ['Готовится к областной олимпиаде следующего года.', 'Келесі жылғы облыстық олимпиадаға дайындалуда.', 'Preparing for next year’s regional olympiad.', 'Gelecek yılın bölgesel olimpiyatına hazırlanıyor.', '正在备战明年的州级奥赛。'],
  ['Алгебра', 'Алгебра', 'Algebra', 'Cebir', '代数'],
  // Регистрация
  ['Регистрация', 'Тіркелу', 'Sign up', 'Kayıt ol', '注册'],
  ['Создайте аккаунт', 'Аккаунт жасаңыз', 'Create an account', 'Hesap oluşturun', '创建账号'],
  ['Меньше минуты. Данные школьников скрыты по умолчанию.', 'Бір минуттан аз. Оқушылардың деректері әдепкі бойынша жасырын.', 'Under a minute. Student data is hidden by default.', 'Bir dakikadan kısa. Öğrenci verileri varsayılan olarak gizli.', '不到一分钟。学生数据默认隐藏。'],
  ['Кто вы?', 'Сіз кімсіз?', 'Who are you?', 'Siz kimsiniz?', '你是谁？'],
  ['Выберите роль. Её можно поменять позже.', 'Рөлді таңдаңыз. Оны кейін өзгертуге болады.', 'Choose a role. You can change it later.', 'Bir rol seçin. Sonra değiştirebilirsiniz.', '选择角色，之后可以更改。'],
  ['Организатор конкурса', 'Байқау ұйымдастырушысы', 'Contest organizer', 'Yarışma organizatörü', '比赛主办方'],
  ['Портфолио и резюме, которым верят вузы', 'ЖОО-лар сенетін портфолио мен түйіндеме', 'A portfolio and resume universities trust', 'Üniversitelerin güvendiği portföy ve özgeçmiş', '高校信任的作品集与简历'],
  ['Выдавать сертификаты с подписью', 'Қолтаңбасы бар сертификаттар беру', 'Issue signed certificates', 'İmzalı sertifika ver', '颁发带签名的证书'],
  ['Искать и проверять таланты', 'Таланттарды іздеу және тексеру', 'Find and verify talent', 'Yetenek bul ve doğrula', '寻找并验证人才'],
  ['Как войти?', 'Қалай кіресіз?', 'How do you want to sign in?', 'Nasıl giriş yapacaksınız?', '如何登录？'],
  ['выберите удобный способ', 'ыңғайлы тәсілді таңдаңыз', 'choose a method', 'bir yöntem seçin', '选择方式'],
  ['Продолжить с Google', 'Google арқылы жалғастыру', 'Continue with Google', 'Google ile devam et', '使用 Google 继续'],
  ['Быстрее всего, без пароля', 'Ең жылдамы, құпиясөзсіз', 'Fastest, no password', 'En hızlısı, şifresiz', '最快，无需密码'],
  ['или', 'немесе', 'or', 'veya', '或'],
  ['Через ИИН', 'ЖСН арқылы', 'With IIN', 'IIN ile', '使用 IIN'],
  ['Проверяем через eGov и не храним', 'eGov арқылы тексереміз және сақтамаймыз', 'Checked via eGov, never stored', 'eGov ile doğrulanır, saklanmaz', '经 eGov 核验，不予存储'],
  ['Подставить тестовый ИИН', 'Тестілік ЖСН қою', 'Use a test IIN', 'Test IIN kullan', '使用测试 IIN'],
  ['Продолжить', 'Жалғастыру', 'Continue', 'Devam', '继续'],
  ['По email', 'Email арқылы', 'With email', 'E-posta ile', '使用邮箱'],
  ['← Назад', '← Артқа', '← Back', '← Geri', '← 返回'],
  ['Расскажите о себе', 'Өзіңіз туралы айтыңыз', 'Tell us about yourself', 'Kendinizden bahsedin', '介绍一下你自己'],
  ['Имя и фамилия', 'Аты-жөні', 'Full name', 'Ad soyad', '姓名'],
  ['Школа', 'Мектеп', 'School', 'Okul', '学校'],
  ['Родитель согласен', 'Ата-ана келіседі', 'Parent agrees', 'Veli onaylıyor', '家长同意'],
  ['Вам меньше 18 лет: нужно согласие родителя. В рабочей версии — SMS-код родителю.', 'Сізге 18 жас толмаған: ата-ана келісімі қажет. Жұмыс нұсқасында — ата-анаға SMS-код.', 'You are under 18, so a parent must agree. In production, the parent gets an SMS code.', '18 yaşından küçüksünüz: veli onayı gerekir. Gerçek sürümde veliye SMS kodu gider.', '你未满 18 岁，需要家长同意。正式版将向家长发送短信验证码。'],
  ['Название организации', 'Ұйым атауы', 'Organization name', 'Kurum adı', '机构名称'],
  ['Новый организатор сначала «не подтверждён». Мы проверим сайт и письмо с домена организации.', 'Жаңа ұйымдастырушы алдымен «расталмаған». Біз сайтты және ұйым доменінен келген хатты тексереміз.', 'New organizers start as “not verified”. We check the website and an email from the organization’s domain.', 'Yeni organizatörler önce “doğrulanmamış” olur. Web sitesini ve kurum alan adından gelen e-postayı kontrol ederiz.', '新主办方初始为“未认证”，我们会核实其网站及域名邮箱。'],
  ['ИИН проверен', 'ЖСН тексерілді', 'IIN verified', 'IIN doğrulandı', 'IIN 已核验'],
  ['Создать аккаунт', 'Аккаунт жасау', 'Create account', 'Hesap oluştur', '创建账号'],
  ['Аккаунт создан', 'Аккаунт жасалды', 'Account created', 'Hesap oluşturuldu', '账号已创建'],
  ['Добро пожаловать в Proofy. Ваш кабинет уже готов.', 'Proofy-ге қош келдіңіз. Кабинетіңіз дайын.', 'Welcome to Proofy. Your dashboard is ready.', 'Proofy’ye hoş geldiniz. Paneliniz hazır.', '欢迎来到 Proofy，你的后台已就绪。'],
  ['Открыть кабинет', 'Кабинетті ашу', 'Open dashboard', 'Paneli aç', '进入后台'],
  ['Прототип: вход через Google и eGov имитируется, пароли и ИИН никуда не отправляются.', 'Прототип: Google және eGov арқылы кіру имитацияланады, құпиясөздер мен ЖСН ешқайда жіберілмейді.', 'Prototype: Google and eGov sign-in are simulated; passwords and IINs are not sent anywhere.', 'Prototip: Google ve eGov girişi simüle edilir; şifre ve IIN hiçbir yere gönderilmez.', '原型：Google 与 eGov 登录为模拟，密码和 IIN 不会被发送。'],
  ['Подключаемся к Google…', 'Google-ға қосылуда…', 'Connecting to Google…', 'Google’a bağlanılıyor…', '正在连接 Google…'],
  ['ИИН должен состоять из 12 цифр', 'ЖСН 12 цифрдан тұруы керек', 'An IIN must have 12 digits', 'IIN 12 haneli olmalıdır', 'IIN 必须为 12 位数字'],
  ['Контрольная цифра ИИН не сходится', 'ЖСН бақылау цифры сәйкес емес', 'The IIN check digit doesn’t match', 'IIN kontrol hanesi uyuşmuyor', 'IIN 校验位不符'],
  ['Неверная цифра века в ИИН', 'ЖСН-дағы ғасыр цифры қате', 'Invalid century digit in the IIN', 'IIN’deki yüzyıl hanesi geçersiz', 'IIN 中的世纪位无效'],
  ['Проверьте email', 'Email-ді тексеріңіз', 'Check the email', 'E-postayı kontrol edin', '请检查邮箱'],
  ['Без согласия родителя аккаунт школьника младше 18 лет создать нельзя', 'Ата-ана келісімінсіз 18 жасқа толмаған оқушының аккаунтын жасауға болмайды', 'A student under 18 can’t sign up without parental consent', '18 yaş altı öğrenci veli onayı olmadan kayıt olamaz', '未满 18 岁的学生须经家长同意才能注册'],
  ['Городская олимпиада по физике', 'Физикадан қалалық олимпиада', 'City physics olympiad', 'Şehir fizik olimpiyatı', '市级物理奥赛'],
  ['Агентство «Bilim Path»', '«Bilim Path» агенттігі', 'Bilim Path agency', 'Bilim Path ajansı', 'Bilim Path 机构'],
  ['СОШ №12', '№12 ЖББМ', 'School No. 12', '12 No’lu Okul', '第十二中学'],
  ['СОШ №2', '№2 ЖББМ', 'School No. 2', '2 No’lu Okul', '第二中学'],
  ['СОШ №5', '№5 ЖББМ', 'School No. 5', '5 No’lu Okul', '第五中学'],
  ['СОШ №1', '№1 ЖББМ', 'School No. 1', '1 No’lu Okul', '第一中学'],
];

/* Транслитерация имён и городов для латиницы и китайского интерфейса */
const TRANSLIT = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', ә: 'a', ғ: 'g', қ: 'q', ң: 'n', ө: 'o', ұ: 'u', ү: 'u', і: 'i', һ: 'h' };
function translit(s) {
  return s.replace(/[А-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүІіҺһ]/g, (ch) => {
    const lo = ch.toLowerCase(), t = TRANSLIT[lo] ?? ch;
    return ch === lo ? t : t.charAt(0).toUpperCase() + t.slice(1);
  });
}
const PROPER = /^[А-ЯЁӘҒҚҢӨҰҮІҺ][А-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүІіҺһ.\-]*(\s+[А-ЯЁӘҒҚҢӨҰҮІҺ][А-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүІіҺһ.\-]*)*$/;

const LEVEL_WORDS = { 'школьный': 1, 'городской': 2, 'областной': 3, 'республиканский': 4, 'международный': 5 };
const LANG_IDX = { ru: 0, kk: 1, en: 2, tr: 3, zh: 4 };
const DICT = new Map(DICT_ROWS.map((r) => [r[0], r]));

/* Шаблоны с числами и именами */
const PATTERNS = [
  [/^Найдено: (\d+)$/, ['Табылды: $1', 'Found: $1', 'Bulunan: $1', '找到：$1']],
  [/^ШАГ (\d+) ИЗ (\d+)$/, ['ҚАДАМ $1 / $2', 'STEP $1 OF $2', 'ADIM $1 / $2', '第 $1 步，共 $2 步']],
  [/^Выдано: (\d+)$/, ['Берілді: $1', 'Issued: $1', 'Verilen: $1', '已颁发：$1']],
  [/^Мои запросы · (\d+)$/, ['Менің сұрауларым · $1', 'My requests · $1', 'Taleplerim · $1', '我的请求 · $1']],
  [/^([\d\s ]+) участников$/, ['$1 қатысушы', '$1 participants', '$1 katılımcı', '$1 名参赛者']],
  [/^Наградили (\d+)% участников$/, ['Қатысушылардың $1%-ы марапатталды', '$1% of participants awarded', 'Katılımcıların %$1’i ödül aldı', '$1% 参赛者获奖']],
  [/^(\d+) (сертификат|сертификата|сертификатов)$/, ['$1 сертификат', '$1 certificates', '$1 sertifika', '$1 份证书']],
  [/^(\d+) (новый|новых)$/, ['$1 жаңа', '$1 new', '$1 yeni', '$1 条新']],
  [/^(\d+) подтверждено$/, ['$1 расталған', '$1 verified', '$1 doğrulandı', '$1 项已验证']],
  [/^Школьник, (\d+) класс$/, ['Оқушы, $1-сынып', 'Student, grade $1', 'Öğrenci, $1. sınıf', '学生，$1 年级']],
  [/^(\d+) класс · (.+)$/, ['$1-сынып · $2', 'Grade $1 · $2', '$1. sınıf · $2', '$1 年级 · $2']],
  [/^Проверка заняла (\d+) мс\.$/, ['Тексеру $1 мс алды.', 'Checked in $1 ms.', 'Doğrulama $1 ms sürdü.', '验证用时 $1 毫秒。']],
  [/^Выдано (\d+) (сертификат|сертификата|сертификатов) · (\d+) мс$/, ['$1 сертификат берілді · $3 мс', '$1 certificates issued · $3 ms', '$1 sertifika verildi · $3 ms', '已颁发 $1 份证书 · $3 毫秒']],
  [/^с «(.+)» не сходится$/, ['«$1» сәйкес емес', 'doesn’t match “$1”', '“$1” ile uyuşmuyor', '与“$1”不符']],
  [/^Проверить (PRF-\S+)$/, ['$1 тексеру', 'Verify $1', '$1 doğrula', '验证 $1']],
  [/^Вход через (.+)$/, ['$1 арқылы кіру', 'Signed in with $1', '$1 ile giriş', '通过 $1 登录']],
  [/^вес (\d+)$/,['салмақ $1', 'weight $1', 'ağırlık $1', '权重 $1']],
  [/^(\d+) мс$/, ['$1 мс', '$1 ms', '$1 ms', '$1 毫秒']],
  [/^API · (\d+) мс$/, ['API · $1 мс', 'API · $1 ms', 'API · $1 ms', 'API · $1 毫秒']],
  [/^(\d+) кл$/,['$1-сынып', 'Grade $1', '$1. sınıf', '$1 年级']],
  [/^(\d+) надёжных$/, ['$1 сенімді', '$1 reliable', '$1 güvenilir', '$1 个可靠']],
  [/^(\d+) под вопросом$/, ['$1 күмәнді', '$1 questionable', '$1 şüpheli', '$1 个存疑']],
  [/^наградили (\d+)%$/, ['$1% марапатталды', '$1% awarded', '%$1 ödül', '$1% 获奖']],
  [/^Выдан организатором «(.+)»\. Проверка заняла (\d+) мс\.$/, ['«$1» ұйымдастырушысы берген. Тексеру $2 мс алды.', 'Issued by “$1”. Checked in $2 ms.', '“$1” tarafından verildi. Doğrulama $2 ms sürdü.', '由“$1”颁发，验证用时 $2 毫秒。']],
  [/^В документе «(.+)», но подпись организатора сходится только с «(.+)»\.$/, ['Құжатта «$1», бірақ ұйымдастырушы қолтаңбасы тек «$2»-мен сәйкес.', 'The document says “$1”, but the organizer’s signature only matches “$2”.', 'Belgede “$1” yazıyor, ama imza yalnızca “$2” ile uyuşuyor.', '文件写着“$1”，但主办方签名只与“$2”相符。']],
  [/^Ни один организатор не выдавал (.+)\. Скорее всего, это подделка\.$/, ['$1 ID-ын бірде-бір ұйымдастырушы бермеген. Бұл жалған болуы ықтимал.', 'No organizer issued $1. It’s most likely a fake.', '$1’i hiçbir organizatör vermedi. Büyük olasılıkla sahte.', '没有任何主办方颁发过 $1，极可能是伪造。']],
  [/^Вес конкурса (\d+) из 100: (.+)\.$/, ['Байқау салмағы 100-ден $1: $2.', 'Contest weight $1 of 100: $2.', 'Yarışma ağırlığı 100 üzerinden $1: $2.', '比赛权重 $1/100：$2。']],
];

function trWord(ru, lang) { const r = DICT.get(ru); return r ? r[LANG_IDX[lang]] : ru; }

function translateString(ru, lang) {
  if (lang === 'ru' || !ru) return ru;
  const row = DICT.get(ru);
  if (row) return row[LANG_IDX[lang]];
  const lvl = ru.match(/^Уровень: (.+)$/);
  if (lvl && LEVEL_WORDS[lvl[1]]) {
    const name = DICT_ROWS.find((r) => r[0].toLowerCase() === lvl[1]);
    return `${trWord('Уровень', lang)}: ${name ? name[LANG_IDX[lang]] : lvl[1]}`;
  }
  for (const [re, outs] of PATTERNS) {
    const m = ru.match(re);
    if (m) {
      let out = outs[LANG_IDX[lang] - 1];
      m.forEach((v, i) => { if (i) out = out.replace(`$${i}`, translateString(v, lang)); });
      return out;
    }
  }
  // Составные строки «A · B · C» — переводим по частям
  if (ru.includes(' · ') || ru.startsWith('· ')) {
    const lead = ru.startsWith('· ') ? '· ' : '';
    return lead + ru.slice(lead.length).split(' · ').map((p) => translateString(p, lang)).join(' · ');
  }
  // Имена, города, инициалы — латиницей для en/tr/zh
  if (lang !== 'kk' && PROPER.test(ru) && ru.length < 40) return translit(ru);
  const cityCount = ru.match(/^(.+) · (\d+)$/);
  if (cityCount) return `${translateString(cityCount[1], lang)} · ${cityCount[2]}`;
  return ru;
}

/* ---- Применение к DOM ---- */
let LANG = 'ru';
try { LANG = localStorage.getItem('proofy-lang') || 'ru'; } catch (e) { /* ignore */ }

function translateNode(node) {
  if (node.__ru === undefined) node.__ru = node.nodeValue;
  const raw = node.__ru;
  const core = raw.trim();
  if (!core) return;
  const t = translateString(core, LANG);
  const next = t === core ? raw : raw.replace(core, t);
  if (node.nodeValue !== next) node.nodeValue = next;
}
function translateAttrs(el) {
  for (const a of ['placeholder', 'title', 'aria-label']) {
    if (!el.hasAttribute || !el.hasAttribute(a)) continue;
    const key = '__ru_' + a;
    if (el[key] === undefined) el[key] = el.getAttribute(a);
    el.setAttribute(a, translateString(el[key], LANG));
  }
}
function translateTree(root) {
  if (!root) return;
  if (root.nodeType === 3) { translateNode(root); return; }
  if (root.nodeType !== 1 || root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
  translateAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => (n.nodeType === 1 && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE' || n.classList.contains('code')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  let n;
  while ((n = w.nextNode())) { if (n.nodeType === 3) translateNode(n); else translateAttrs(n); }
}
const i18nObserver = new MutationObserver((muts) => {
  for (const m of muts) m.addedNodes.forEach((n) => translateTree(n));
});
function setLang(code) {
  LANG = code;
  try { localStorage.setItem('proofy-lang', code); } catch (e) { /* ignore */ }
  document.documentElement.lang = code;
  translateTree(document.body);
  document.querySelectorAll('[data-lang-current]').forEach((el) => { el.textContent = LANGS.find((l) => l.code === code).short; });
  document.querySelectorAll('[data-lang]').forEach((el) => el.classList.toggle('on', el.dataset.lang === code));
}
function startI18n() {
  i18nObserver.observe(document.body, { childList: true, subtree: true });
  setLang(LANG);
}
