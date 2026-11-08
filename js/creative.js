// Исходные работы из creative: файл, заголовок, описание и категория портфолио.
// Коллажи используются целиком. Для новой работы добавьте запись и её ключ в подборку ниже.
function creativeWork(folder, file, title, description, category) {
  var imageFolder = folder === 'portfolio' ? 'portfolio/clean' : folder;
  return {src: encodeURI('creative/' + imageFolder + '/' + file), title: title, description: description, category: category};
}

var CREATIVE = {
  landings: creativeWork('From creative', '2f455354-5a25-49f6-a583-d276fa321e2e.png', 'Лендинги для разных задач', 'Игры, креативная студия, сборка ПК, дизайн и туристическое снаряжение.', 'web'),
  webFormats: creativeWork('From creative', '88605149-2c65-4d03-ad60-4267745da2af.png', 'Сайты на разных экранах', 'Лендинг, сайт-визитка и интерфейс: примеры для компьютера и телефона.', 'web'),
  webLayouts: creativeWork('From creative', '86855e3a-4917-4989-8129-34db7a5bba00.png', 'Дизайн веб-страниц', 'Разные композиции, палитры и форматы страниц.', 'web'),
  businessSites: creativeWork('From creative', 'bb99828f-bc25-4c55-8a6d-13a987653921.png', 'Сайты-визитки', 'Подборка концепций для студий, специалистов и небольшого бизнеса.', 'web'),
  studioSite: creativeWork('From creative', '43acdeae-4047-4f19-b11d-6e3f30e0bb07.png', 'Креативная студия: страницы сайта', 'Первый экран, услуги, работы и контакты в общем стиле.', 'web'),
  brightSite: creativeWork('From creative', 'ccccfdc5-10bb-4a65-b44a-cf23bac2536d.png', 'Яркий сайт студии', 'Неоновые акценты, типографика и карточки проектов.', 'web'),
  interfaces: creativeWork('another', '39d25fac-9e65-4f1d-b460-192264b9e459.png', 'Интерфейс сообщества', 'Личный кабинет, списки и мобильные экраны.', 'web'),
  dashboard: creativeWork('portfolio', 'ccc21713-8947-4ebd-a098-485e31a62eed.png', 'Панель управления', 'Карточки, графики, списки и мобильная версия интерфейса.', 'web'),
  neonUI: creativeWork('From creative', '955e3e83-1152-4297-8d38-f6029f0a5caf.png', 'Неоновые интерфейсы', 'Четыре визуальные концепции для цифровых проектов.', 'design'),
  adverts: creativeWork('From creative', 'cfca78ac-422e-4e5d-9512-8e314ed4e50c.png', 'Реклама с характером', 'Шесть креативов: иллюстрация, короткий текст и необычная идея.', 'ads'),
  plumber: creativeWork('From creative', '1791657879.png', 'Креативная прочистка', 'Рекламный плакат с персонажем в ретро-стиле.', 'fun'),
  inspector: creativeWork('From creative', '1791657888.png', 'Диз-инспектор', 'Ироничный рекламный концепт с жуком и печатями.', 'fun'),
  funnyCards: creativeWork('From creative', 'a63157a7-8b56-4f1d-81bd-b77f7c6c7b34.png', 'Необычные рекламные карточки', 'Персонажи и неожиданные профессии в разных визуальных стилях.', 'fun'),
  newspaper: creativeWork('From creative', 'Nsev9vvEdqX7B-lobuFOsVk7jwbGyqVtIQfXXTNfKkLw3kc_yGslUOrP5OXIkIF1smOKKOm3QgT_V9w2nw9-31jO.jpg', 'Рекламная газета', 'Ироничные объявления и плакаты в формате газетной полосы.', 'fun'),
  aivaGroups: creativeWork('another', 'ChatGPT Image 8 июл. 2026 г., 07_48_10.png', 'Оформление сообщества AiVA', 'Обложки, аватары и карточки публикаций в едином стиле.', 'groups'),
  memeGroups: creativeWork('another', 'ChatGPT Image 8 июл. 2026 г., 03_43_34.png', 'Мемы, живопись и чисто поржать', 'Обложки и аватары для сообщества: несколько вариантов оформления.', 'groups'),
  vkSet: creativeWork('another', 'Набор для вк.png', 'Карточка для ВКонтакте', 'Неоновый персонаж и рекламная карточка услуги.', 'groups'),
  aivaPoster: creativeWork('another', '1332111.png', 'Постер AiVA', 'Персонаж, типографика и фиолетовые акценты.', 'ads'),
  aivaCard: creativeWork('another', 'Визитка.png', 'Презентационная визитка AiVA', 'Услуги, фирменный персонаж и контакты на одном макете.', 'print'),
  gamebarCards: creativeWork('Old', 'dbpbnre nhe.png', 'Визитки Game Bar', 'Два варианта оформления в неоновой палитре.', 'print'),
  halloweenCard: creativeWork('Old', 'e155e923-feff-49ad-a42c-870d3c72ad9c.png', 'Game Bar: Хэллоуин', 'Тематическая визитка с игровыми и праздничными деталями.', 'print'),
  flyer: creativeWork('Old', 'листовка.png', 'Листовка Game Bar', 'Ретро-графика для интернет-кафе и игрового пространства.', 'print'),
  autumn: creativeWork('Old', 'осень 2.png', 'Осенний плакат Game Bar', 'Неоновая афиша с программой и игровым настроением.', 'print'),
  winter: creativeWork('Old', 'зима.png', 'Зимняя афиша Game Bar', 'Праздничная афиша для игрового пространства.', 'print'),
  booklet: creativeWork('portfolio', 'European_booklet_for_a_video_game_company__Pixel_graphics__company_information__and_gam1752737876525.png', 'Буклет игровой студии', 'Разворот с информацией о студии и пиксельными игровыми иллюстрациями.', 'print'),
  aivaBrand: creativeWork('another', '29681852-f8b0-4c9a-84a2-293e55e14437.png', 'Фирменный стиль AiVA', 'Персонаж, логотип, палитра, карточки и носители бренда.', 'brand'),
  averaBrand: creativeWork('another', 'f2ae5a3d-7da5-4145-a6d0-c605574794ea.png', 'Брендбук AVERA', 'Айдентика, персонаж и примеры фирменных носителей.', 'brand'),
  minimalLogos: creativeWork('another', '4663faa1-7bde-4c3f-950e-505786675f71.png', 'Логотипы ALTVERIS и ALTVERA', 'Минималистичные знаки, типографика и применение в айдентике.', 'logo'),
  foxBadge: creativeWork('portfolio', 'kling_20251205_Text_to_Image_The_logo_o_2821_6.png', 'SARANSK 13: эмблема', 'Лиса, круглая композиция и спортивная типографика.', 'logo'),
  foxLogo: creativeWork('portfolio', 'kling_20251205_Text_to_Image_The_logo_o_2864_2.png', 'SARANSK 13: знак', 'Лаконичный вариант спортивного логотипа.', 'logo'),
  mascot: creativeWork('another', 'ChatGPT Image 31 июл. 2026 г., 13_08_21.png', 'Маскот AiVA', 'Персонаж с ноутбуком для фирменных иллюстраций.', 'brand'),
  packaging: creativeWork('portfolio', '_______________________________________________________________________________________1747917558999.png', 'Упаковка Astrocar', 'Концепт коробки с ретро-автомобилем и неоновой графикой.', 'brand'),
  pixelDrink: creativeWork('portfolio', 'pixel_graphics__jrpg_style_soda_made_from_butterflies_in_a_tin_cant__JAPAN_RPG_STYLE1753354490214.png', 'Пиксельная реклама напитка', 'Продуктовый визуал в стилистике японской RPG.', 'ads'),
  matchGame: creativeWork('portfolio', 'Gameplay_screenshot_of_a_match_3_puzzle_game_inspired_by_the__Delicious_in_Dungeon__ani1749118990057.png', 'Игровой концепт: три в ряд', 'Существа, подземелье и игровое поле. Визуальная концепция.', 'games'),
  pixelHero: creativeWork('portfolio', 'pixel_graphics__jrpg_style__hero__3d_artist__artist__big_color_pencil_sword__girl___blo1753198277116.png', 'Пиксельный герой', 'Персонаж с мечом-карандашом и окружение для игрового концепта.', 'games'),
  comicHero: creativeWork('portfolio', 'A_portrait_of_a_character_drawn_in_retro_futurism_style_for_a_comic__This_is_a_chubby_f1748954745026.png', 'Персонаж в стиле ретрофутуризма', 'Иллюстрация для комикса: костюм, характер и цвет.', 'design'),
  fourWorlds: creativeWork('From creative', 'Неоновый киберпанк_ четыре мира.png', 'Четыре визуальных мира', 'Персонаж, предмет, пейзаж и музыкальная сцена.', 'design')
};

// Подборка для общего портфолио.
var CREATIVE_PORTFOLIO = [
  'landings', 'businessSites', 'brightSite', 'interfaces', 'dashboard',
  'adverts', 'aivaPoster', 'pixelDrink', 'aivaGroups', 'memeGroups',
  'aivaCard', 'gamebarCards', 'flyer', 'autumn', 'winter', 'booklet',
  'aivaBrand', 'averaBrand', 'packaging', 'mascot', 'minimalLogos', 'foxBadge', 'foxLogo',
  'matchGame', 'pixelHero', 'comicHero', 'fourWorlds', 'plumber', 'inspector', 'funnyCards', 'newspaper'
];
