<footer class="infos" id="infos">
  <div class="container-fluid">
    <div class="row">
      <div class="col-xs-10 col-xs-offset-1">
        <section class="info__header">
          <h1><img src="{{ url('/images/') }}/gioiaseghers-logo.svg" alt="Gioa Seghers"></h1>
        </section>
        <section class="info__about">
          @markdown($text01->text)
        </section>
        <section class="info__biography info-box">
          <div class="box__title">
            <h2>Biography</h2>
          </div>
          <div class="box__content">
            @markdown($text02->text)
          </div>
        </section>
        <section class="info__contact info-box">
          <div class="box__title">
            <h2>Contact</h2>
          </div>
          <div class="box__content">
            @markdown($text03->text)
          </div>

        </section>
        <section class="info__stockists info-box">
          <div class="box__title">
            <h2>Stockists</h2>
          </div>
          <div class="box__content">
            @markdown($text04->text)
          </div>
        </section>
        <section class="info__social">
          <div class="social__newsletter">
            <h2>Newsletter</h2>
            <!-- Begin MailChimp Signup Form -->
            <div class="info__form mailchimp-form">
              <link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css">
              <div id="mc_embed_signup">
                <form action="//gioiaseghers.us9.list-manage.com/subscribe/post?u=0f2d395aefc227240dc7ec69d&amp;id=e887f07d78" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
                  <div id="mc_embed_signup_scroll">
                    <label for="mce-EMAIL">Newsletter</label>
                    <input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required>
                      <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                      <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_0f2d395aefc227240dc7ec69d_e887f07d78" tabindex="-1" value=""></div>
                      <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
                    </div>
                </form>
              </div>
            </div>
            <!--End mc_embed_signup-->
          </div>
          <div class="social__links">
            <a href="https://www.facebook.com/Gioia-Seghers-540117389420272/?fref=ts&ref=br_tf" target="_blank">Facebook</a>
            <a href="https://www.instagram.com/gioiaseghers/" target="_blank">Instagram</a>
          </div>
        </section>
        <section class="info__credits">
          <p>website design &amp; developement by <a href="http://variable.club/" target="_blank">Variable</a></p>
        </section>
      </div>
    </div>
  </div>
</footer>
