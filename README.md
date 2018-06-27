# Boilerplate

[![forthebadge](http://forthebadge.com/images/badges/powered-by-netflix.svg)](http://forthebadge.com)

A starting point for creating static websites.

Features:
* Sass/SCSS
* Handlebars templating
* ES6 minification & bundling
* Live injection/reload with BrowserSync 

### Ian's Fork Notes

This particular fork adds Bootstrap, jQuery, and Popper.js. This fork also removes grid.scss in favor of Bootstrap.

### Quick Setup

Add this to your `~/.bash_profile` for a quick command to set up a static boilerplate:

```
# $1 = website domain name
new_static_site(){
  cd ~/workspace-html/
  git clone git@github.com:ianrandmckenzie/static-boilerplate.git
  mv static-boilerplate $1
  cd $1
  rm -rf .git
  git init
  git add .
  git commit -m "Initial commit for "$1
  npm install
  gulp
}
```

### Getting Started

Clone the repo using `git clone` or by clicking the *Download ZIP* button to the right.

```sh
git clone https://github.com/jadnco/boilerplate.git
```

Navigate to the directory to where it was cloned.

```sh
cd boilerplate
```

Install all dependencies using npm:

```sh
npm install
```

Run the default Gulp task to get started:

```sh
gulp
```

BrowserSync will automagically inject any changes you make to the stylesheets. You can view the website at one of the given access URLs:

```sh
[BS] Access URLs:
 ----------------------------------
       Local: http://localhost:3000
    External: http://10.0.X.XX:3000
 ----------------------------------
```

If you are working within a GitHub repo you can deploy your project, at any time, to a `gh-pages` branch by running:

```sh
gulp deploy
```

### Credits

- Responsive grid from [Skeleton](http://getskeleton.com) by [Dave Gamache](https://github.com/dhg)