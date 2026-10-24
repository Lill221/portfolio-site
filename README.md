# TIKHNG — video editor portfolio

Кинематографичный адаптивный лендинг для Тихона / TIKHNG. Создан по предоставленному HTML-макету и записи экрана: чёрная палитра, крупная типографика, проявление текста при прокрутке, короткое вступление и живые превью.

## Запуск

Готовый сайт находится в `dist/`. Сборка и npm-зависимости не нужны. Для предпросмотра из корня репозитория:

```sh
python -m http.server 4173 --directory dist
```

Открыть `http://localhost:4173`. Для размещения на другом статическом хостинге загрузить содержимое `dist/`.

## Содержимое

- `dist/index.html` — контент и семантическая структура.
- `dist/styles.css` — адаптивный дизайн и анимации; мобильный breakpoint 700 px.
- `dist/script.js` — скролл, меню, плеер, пауза движения и аккордеон услуг.
- `dist/assets/` — локальные шрифты, изображения, видео и лицензия шрифта.
- `.openai/hosting.json` — идентификатор и конфигурация Sites.

Три видео предоставлены автором и подтверждены им как собственные работы. Рабочие названия можно поменять в HTML:

| Файл автора | Раздел | Полный ролик | Превью |
| --- | --- | --- | --- |
| `2.MP4` | City sessions | `assets/work-2.mp4` | `assets/preview-2.mp4` |
| `1.MP4` | Collage edit | `assets/work-1.mp4` | `assets/preview-1.mp4` |
| `3.MP4` | VFX cut | `assets/work-3.mp4` | `assets/preview-3.mp4` |

Превью без звука загружаются только при появлении в экране. Полные видео сохраняют звук и открываются после нажатия. Закрытие диалога останавливает воспроизведение; фоновые превью при открытом плеере приостановлены. Реализована поддержка `prefers-reduced-motion`, клавиатуры и кнопки паузы анимации.

## Следующий этап

По запросу автора кнопки связи пока показывают сообщение-заглушку. Контакты, окончательные названия работ и биографический текст можно уточнить позднее. Контактные адреса из исходного макета не активированы.

## Визуальные материалы

Manrope используется по SIL Open Font License; лицензия лежит в `dist/assets/OFL-Manrope.txt`. Шрифты загружаются локально.

`dist/assets/wave.webp` — фон, созданный встроенным imagegen для этого сайта. Он служит оформлением и не представлен как работа автора. Исходный промпт: «Use case: photorealistic-natural. Asset type: full bleed cinematic background for a minimalist video editor portfolio. Create a widescreen 16:9 black and white macro photograph of a sculptural ocean wave / flowing black liquid, with fine silver highlights and foamy spray. Very dark deep blacks, cinematic film grain, low key lighting, highly tactile and photorealistic. A large curling wave shape spans the right two thirds diagonally, leaving darker negative space in the left third and center for white typography. Editorial arthouse film still, dramatic but restrained. No people, no text, no lettering, no logo, no watermark, no frame. Render 1920x1080 or similar landscape.»

## Проверка

Синтаксис JavaScript: `node --check dist/script.js`. В браузере проверены desktop 1440×900 и mobile 390×844, загрузка локальных медиа, меню, раскрытие услуг и видеоплеер. Нет внешних runtime-зависимостей.
