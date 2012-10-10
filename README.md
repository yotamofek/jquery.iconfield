# jquery.iconfield

## Introduction

This jQuery plugin is used for creating nifty text fields with an icon on the left side.

The icon can be used for emphasizing the role of the text box to the user,
and can be used as an interactive element by binding to its events.
The text that the user enters in the field will not overlap the icon.

## Basic usage

To initialize the iconfield on an existing textbox:
```javascript
$('#search-field').iconfield( {
  'image-url' : 'imgs/search.png'
} );
```

## Options

The following options are available:
<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Values</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>image-url</code></td>
      <td>URL used to load the icon. (e.g.: <code>imgs/search.png</code>)</td>
    </tr>
    <tr>
      <td><code>icon-cursor</code></td>
      <td>The cursor to be displayed when the mouse is hovering over the icon. (See http://www.w3schools.com/cssref/pr_class_cursor.asp)</td>
    </tr>
    <tr>
      <td><code>horizontal-padding</code></td>
      <td>Number of pixels with which to pad the left and right sides of the icon.</td>
    </tr>
    <tr>
      <td><code>vertical-padding</code></td>
      <td>Number of pixels with which to pad the top and bottom sides of the icon.</td>
    </tr>
  </tbody>
</table>

The iconfield's options may be set at initialization time.

To modify options after the iconfield has been created, the `option` method may be used.
A call to the `refresh` method should always be present after a change of option, to allow the iconfield to refresh the textfield's style.
```javascript
$('#search-field').iconfield( 'option', {
  'icon-cursor' : 'pointer'
} );
$('#search-field').iconfield( 'refresh' );
```

## Methods

The following methods are available:
### `refresh( )`
Re-style the text field to adapt to a new icon or new padding values.
No visual change will occur after changing an option without first calling this function.

#### Parameters
None.

#### Usage
```javascript
$('#search-field').iconfield( 'refresh' );
```

### `isEventOnIcon( e )`
Check if a given mouse event occurred on the icon.

#### Parameters
`e` - a mouse event

#### Usage
```javascript
$('#search-field').on( 'mousedown', function( e ) {
  if( $('#search-field').iconfield( 'isEventOnIcon', e ) {
    // do something...
  }
} );
```

### `option( name[, value] )`
Change or retrieve an iconfield option.

#### Parameters
`name` - the name of the option to get/set

`value` - the value to set

#### Usage
```javascript
var oldCursor = $('#search-field').iconfield( 'option', 'icon-cursor' );
$('#search-field').iconfield( 'option', 'icon-cursor', 'pointer' );
```
Alternatively, the method can also be called with a named map:
```javascript
$('#search-field').iconfield( 'option', {
  'image-url'           : 'imgs/load.png',
  'horizontal-padding'  : 2
} );
```