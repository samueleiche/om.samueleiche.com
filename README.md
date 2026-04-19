<br>

<h3 align="center">OM</h3>
<h4 align="center">A Minute for Mindfulness</h3>

<p align="center">
    App available online at <b><a href="https://om.samueleiche.com">om.samueleiche.com</a></b>
</p>

<br>

This app makes sound at intervals to encourage regular breaks and to remind you to pause, breathe and center yourself throughout the day.

## The Meaning

**_Bīja_** — **a seed**; a figurative symbol of the potential for something to unfold or develop, and its basic cause. The best-known _bīja_ syllable is Oṃ (Tib.: ༀ).

## What is Mindfulness?

> Mindfulness is the continuous practice of touching deeply every moment of daily life. To be mindful is to be truly present with your body and your mind, to harmonize your intentions and actions, and to be in harmony with those around you. \
>  — Thich Nhat Hanh, Zen master

Mindfulness can be practiced at any time, whether we are in the office, kitchen, or bathroom. We can invite mindfulness into our daily activities such as sitting, working, and eating, and so on - with mindful awareness of what we're doing.

## How (and Why) to Use the Mindfulness Reminder

> The opposite of mindfulness is forgetfulness. — Thich Nhat Hanh

Taking small moments during the day to connect with the body, and to the present moment, can greatly increase happiness and ease.

Our tendency is to forget that we are in the present moment right now or that we are breathing. It's common to lose awareness while working on computers. Similar to physical exercise, the longer we go without practicing mindfulness, the more challenging it becomes to start again.

> Short moments repeated many times. — Tulku Urgyen Rinpoche, from his book "As It Is"

Developing a habit of mindfulness begins with making small, consistent commitments. A short duration of mindful practice guarantees it is authentic. If we force ourselves into longer practices, our minds can become dull or restless and we lose the essence of awareness.

A bell programmed to make sound at intervals can remind us to stop and be present again when we have been forgetful. In the **OM** app, you can set reminders at intervals that suit you.

Whenever the bell sounds, you can use it as a cue to pause what you are doing and take three mindful breaths, returning to the here and now, reconnecting with your body. Even for only a few moments, you have a chance to check in with yourself. After enjoying a few breaths, you may notice that you have become tense, need to straighten your back, or that you have moved away from your intended task.

#### For Meditation

> Stress is caused by being "here" but wanting to be "there" — Eckhart Tolle

**OM** can aid your meditation practice. While meditation typically requires very little, a recurring bell can be practical and offer several benefits:

- Continuous alertness: The sound of the bell can remind us to return to our original intention if our mind has started to wander.
- Undivided attention: Guided by a timer, we can wholly immerse ourselves in our practice. By temporarily relaxing thoughts of the past and future, we can be fully present, unconcerned about how long we've meditated for or when to end our session.
- We avoid overdoing it: We might get carried away and meditate for too long, leading to discomfort or loss of interest. A timer set to a short interval can prevent this by gently ending the session. Stopping a meditation session earlier than we would like to leads us to wanting more later.

## Features

The app is built as a Progressive Web App (PWA):

- **Cross-Platform**: Runs in any widely-used browser on mobile or desktop.
- **Installable**: Behaves like a native app once added to your home screen or desktop.
- **Offline Access**: Works without an internet connection after the first use.
- **Minimalist Design**: Simple, focused, and meaningful by design.

**Notes on usage:**<br>Modern browsers often optimize memory by suspending inactive tabs. Installing the app directly to your device or adding it to your browser's "Memory Saver" ignore list ensures the timer isn't silenced.

On mobile devices, the app may go idle when running in the background or when the screen is off due to system optimizations and [PWA constraints](https://bugs.chromium.org/p/chromium/issues/detail?id=889077). To help with this, the [Screen Wake Lock](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) is used to prevent the screen from turning off while the timer is running. Please note that keeping the screen active may increase battery usage.

#### Screenshots

<table>
    <tr>
        <td>
            <img src="./screenshots/screenshot-android.jpg" />
        </td>
        <td>
            <img src="./screenshots/screenshot-windows.jpg" />
        </td>
    </tr>
</table>

## Development

```bash
# clone repo
git clone https://github.com/samueleiche/om.samueleiche.com.git

# install dependencies
npm i

# run app at https://localhost:5173
npm run dev
```

## Credits & Gratitude

- Inspired by:
    - Futureproof's Awareness
    - Thich Nhat Hanh's Mindfulness Bell
- Sound effect: Ben Burnes
- Bowl image: SivanaSpirit
- Background images: Geran de Klerk, Bahman Farzad, Otaka Photos

## Sharing the Gift of Mindfulness

The app is usable online for free. I designed it with my own well-being in mind and believe it has the potential to benefit anyone. Please, feel free to share it with anyone who may find value in it.

## Licence

The [code](https://github.com/samueleiche/om.samueleiche.com) is licensed under [MIT](./LICENCE).
