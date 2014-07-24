
<div id="upload">
    <div class="formWrapper">
        <form method="post" action="/service/s.upload.php" enctype="multipart/form-data">
            <input type="text" name="name" placeholder="Dein Name"/>
            <span class="locationLabel">Veranstaltung:</span>
            <select name="location" >
                <option value="polterabend">Polterabend</option>
                <option value="standesamt">Standesamt</option>
                <option value="hochzeit" selected>Hochzeit</option>
                <option value="diverses">Diverses</option>
            </select>
            <input type="hidden" name="poster"/>
            <input type="hidden" name="amount"/>
            <input type="hidden" name="index"/>
            <div class="msgBox">
                Teile deine Bilder und lade sie hier hoch.
            </div>
            <div class="menu">
                <div id="drop">
                    <a href="#">Bilder auswählen</a>
                    <input type="file" multiple="" name="upl">
                </div>

                <a class="exit">Schließen</a>
                <a href="#" id="triggerUpload">Hochladen</a>
            </div>
            <ul class="preview_list">
            </ul>
        </form>
    </div>
</div>