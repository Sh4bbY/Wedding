<div id="guestbook" class="category_content" data-order="2">
    <div class="bb-custom-wrapper content">

        <div id="bb-bookblock" class="bb-bookblock bb-vertical">
            <?php
                $entries = $db->guestbook->getEntries();

                for($i=0;$i<sizeof($entries);$i++)
                {
                    $name = $entries[$i]["name"];
                    $date = $entries[$i]["date"];
                    $entry = nl2br($entries[$i]["entry"]);
            ?>

            <div class="bb-item">
                <form class="guestbook_form">
                    <ul>
                        <li>
                            <input type="text" name="name" placeholder="Dein Name">
                        </li>
                        <li>
                            <textarea name="msg" cols="37" rows="4" placeholder="Dein Text"></textarea>
                        </li>
                        <li>
                            <input type="submit" value="Eintragen"/>
                        </li>
                    </ul>
                </form>
                <div class="entry">
                    <div class="info">
                        <div class="name"><?php echo $name; ?></div>
                        <div class="date"><?php echo date("h:i - d.m.y",strtotime($date)) ?></div>
                    </div>
                    <div class="msg_container">
                        <?php echo $entry; ?>
                    </div>
                </div>
            </div>

            <?php
                }
            if(sizeof($entries) == 0)
            {
            ?>
                <div class="bb-item">
                    <form class="guestbook_form">
                        <ul>
                            <li>
                                <input type="text" name="name" placeholder="Dein Name">
                            </li>
                            <li>
                                <textarea name="msg" rows="4" placeholder="Dein Text"></textarea>
                            </li>
                            <li>
                                <input type="submit" value="Eintragen"/>
                            </li>
                        </ul>
                    </form>
                    <div class="entry">
                        <div class="info">
                            <div class="name"></div>
                            <div class="date"></div>
                        </div>
                        <div class="msg_container"></div>
                    </div>
                </div>
            <?php
            }
            ?>

            <nav id="bb-nav">
                <a id="bb-nav-prev" href="#">Zurück</a>
                <span class="page-count"></span>
                <a id="bb-nav-next" href="#">Weiter</a>
            </nav>
        </div>


    </div>
</div>