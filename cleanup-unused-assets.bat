@echo off
echo =============================================
echo  Removing UNUSED assets from git repo
echo  (Only files NOT used by index.html)
echo =============================================
echo.

echo --- Removing unused IMAGES ---
cd assets\images

del "color baby moses.jpg"
del "color croc 1.png"
del "color croc 2.jpg"
del "color croc 2.png"
del "color croc 3 new.png"
del "color croc 3 trans.jpg"
del "color croc 3.jpg"
del "color moses 1.jpg"
del "color moses 2.jpg"
del "color moses 3 new.png"
del "color moses 3.jpg"
del "color moses 4.jpg"
del "color snake.jpg"
del "crab 3.jpg"
del "crab 4.png"
del "crab 6.png"
del "crab 7.png"
del "easy_word_search_5a.jpg"
del "fish 3.jpg"
del "fish 5.jpg"
del "gemini-2.5-flash-image_Bright_colorful_3D_cartoon_Pixar_Disney-inspired_smooth_shading_soft_lighting_ro-0(4).jpg"
del "gemini-2.5-flash-image_Bright_colorful_3D_cartoon_Pixar_Disney-inspired_smooth_shading_soft_lighting_ro-0(5).jpg"
del "gemini-2.5-flash-image_Bright_colorful_3D_cartoon_Pixar_Disney-inspired_smooth_shading_soft_lighting_ro-0(5)fdg.jpg"
del "gemini-2.5-flash-image_Bright_colorful_3D_cartoon_Pixar_Disney-inspired_smooth_shading_soft_lighting_ro-0(6).jpg"
del "gemini-2.5-flash-image_Bright_colorful_3D_cartoon_Pixar_Disney-inspired_smooth_shading_soft_lighting_ro-0(7).jpg"
del "gemini-2.5-flash-image_Bright_colorful_3D_cartoon_Pixar_Disney-inspired_smooth_shading_soft_lighting_ro-0(9).jpg"
del "lucid-origin_Bright_colorful_3D_cartoon_Pixar_Disney-inspired_smooth_shading_soft_lighting_ro-0(13).jpg"
del "lucid-origin_Bright_colorful_3D_cartoon_Pixar_Disney-inspired_smooth_shading_soft_lighting_ro-0(14).jpg"
del "lucid-origin_Bright_colorful_3D_cartoon_Pixar_Disney-inspired_smooth_shading_soft_lighting_ro-0(9).jpg"
del "lucid-origin_Bright_colorful_3D_cartoon_Pixar_Disney-inspired_smooth_shading_soft_lighting_ro-0(9)gfg.jpg"
del "new princess.png"
del "octopus 3.jpg"
del "pink octopus.png"
del "purple squid.jpg"
del "red crab.png"
del "shark 3.jpg"
del "snake 5.png"
del "snake 8.png"
del "snake.png"
del "squid 3.jpg"
del "star 1.jpg"
del "star 2 new.png"
del "star 2.jpg"
del "wave.png"
del "yellow fish.png"

cd ..\..

echo --- Removing unused AUDIO ---
cd assets\audio

del "bg music.mp3"
del "chime.mp3"
del "click 2.mp3"
del "click 3.mp3"
del "click.mp3"
del "congratulations.mp3"
del "error soft 2.mp3"
del "error soft.mp3"
del "game bonus.mp3"
del "game lookp music.mp3"
del "game music background.mp3"
del "success 1.mp3"
del "success 2.mp3"
del "water splash 2.mp3"

cd ..\..

echo.
echo =============================================
echo  Done! Now run these git commands:
echo.
echo    git add -A
echo    git commit -m "Remove unused asset files"
echo    git push origin main
echo =============================================
pause
