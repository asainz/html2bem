# html2bem
> Simplifies writing html with bem classes by adding bem attributes

`html2bem` allows you to wirte html with bem classes in a more simple, readable way, with custom attributes that identify easily what the meaning for each name is.

## Usage

### npm module

You can use it as a npm module.

#### public API

`parse()` receives the html content that needs to parsed and returns the parsed output.

#### installation

```
$ npm install --save-dev html2bem
```

### grunt pluging

You can use it as a grunt pluging.

#### installation

```
$ npm install --save grunt-html2bem
```

## How it works

It transform this:

```html
<!doctype html>
<html>
    <head></head>
    <body>

        <div bem-block="modal" bem-modifier="red" class="my-custom-color fixed">
            <div bem-element="title" bem-modifier="highlited"></div>
            <div bem-element="title" bem-modifier="highlited red" class="themp"></div>
            <div bem-element="content"></div>
            <div bem-element="buttons-container"></div>
        </div>

        <div bem-block="modal" bem-modifier="big"></div>
        <div bem-block="navbar"></div>

    </body>
</html>

```

into this:

```html
<!doctype html>
<html>
    <head></head>
    <body>

        <div class="my-custom-color fixed modal modal--red">
            <div class="modal__title modal__title--highlited"></div>
            <div class="themp modal__title modal__title--highlited modal__title--red"></div>
            <div class="modal__content"></div>
            <div class="modal__buttons-container"></div>
        </div>

        <div class="modal modal--big"></div>
        <div class="navbar"></div>

    </body>
</html>

```

### attributes

You have 3 attributes that will help you do the classes

`bem-block` defines a bem block  
`bem-element` defines a bem element. Always, it has to be inside a bem-block. Otherwise, it will be ignored.  
`bem-modifier` defines a bem modifier. Always, it has to be in the same html node as a `bem-block` or `bem-element`. Otherwhise, it will be ignored.  