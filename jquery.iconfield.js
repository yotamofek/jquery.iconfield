(function( $ ) {

	var methods = {
		isEventOnIcon : function( e ) {
			var $this = $(this),
				x = e.pageX - $this.position().left,
				y = e.pageY - $this.position().top,
				horizontalPadding = $this.iconfield( 'option', 'horizontal-padding' ),
				verticalPadding = $this.iconfield( 'option', 'vertical-padding' ),
				imageWidth = $this.iconfield( 'option', 'image-width' ),
				imageHeight = $this.iconfield( 'option', 'image-height' );



				return (
					(x >= horizontalPadding && x <= horizontalPadding + imageWidth)
					&&
					(y >= verticalPadding && y <= verticalPadding + imageHeight)
				);
		},

		refresh : function( ) {
			return this.each( function() {

				var $this = $(this),
					data = $this.data( 'iconfield' ),
					image = new Image();

				image.onload = function( ) {

					var style_map = {
						'background-image'		:	'url(' + data['image-url'] + ')',
						'background-repeat'		:	'no-repeat',
						'background-position'	:	data['horizontal-padding'] + 'px center',
						'padding-left'			:	image.width + data['horizontal-padding'] * 2,
					};

					// calculate the minimal height this textfield should take,
					// taking into account the image's height and paddings beneath and above it
					var minimal_height = (image.height + data['vertical-padding'] * 2);
					var current_height = Number($this.css( 'height' ).slice(0, -2))

					// add padding if the field's current height is not high enough to include the image
					// (+ vertical padding)
					if( current_height < minimal_height ) {
						var padding = (minimal_height - current_height) / 2;
						$.extend( style_map, {
							'padding-top'		:	padding,
							'padding-bottom'	:	padding,
						} );
					}

					// add image dimensions to the data stored for this element
					$.extend( data, {
						'image-width'	:	image.width,
						'image-height'	:	image.height
					} );
					$this.data( 'iconfield', data);
					
					// update the field's style
					$this.css( style_map );
				}

				image.src = data['image-url'];

			} );

		},

		init : function( options ) {

			return this.each( function() {

				var $this = $(this);

				// initialize the element's iconfield data with the defaults
				$this.data( 'iconfield', new Object() );
				$this.iconfield( 'option', $.extend( {
					'horizontal-padding'	:	2,
					'vertical-padding'		:	4,
					'icon-cursor'			:	'auto'
				}, options ) );

				var events = [ 'click' ];

				// create a custom event that is triggered when the icon is clicked
				$this.on( 'click', function( e ) {
					if($this.iconfield( 'isEventOnIcon', e ) ) {
						$this.trigger( 'iconfield.click' );
					}
				} );

				// bind to mousemove for simulating mouseenter and mouseleave events
				$this.on( 'mousemove', function( e ) {
					var data = $this.data( 'iconfield' ),
						wasOnIcon = data['was-on-icon'] ? data['was-on-icon'] : false,
						curOnIcon = $this.iconfield( 'isEventOnIcon', e );

					// this is obvious
					$this.trigger( 'iconfield.mousemove' );

					// if the mouse is on the icon and wasn't before, or vice versa,
					// trigger the relevant event and store the current position of
					// the mouse
					if( curOnIcon != wasOnIcon ) {
						if( curOnIcon && !wasOnIcon ) {
							$this.trigger( 'iconfield.mouseenter' );
						}
						else if( !curOnIcon && wasOnIcon ) {
							$this.trigger( 'iconfield.mouseleave' );
						}

						data['was-on-icon'] = curOnIcon;
						$this.data( 'iconfield', data );
					}
				} );

				// bind to our simulated mouseenter event to change the cursor
				// when the mouse is hovering over the icon
				$this.on( 'iconfield.mouseenter', function( e ) {
					var data = $this.data( 'iconfield' ),
						curCursor = $this.css( 'cursor' );

					// 'auto' means that no special cursor was specified by the user
					if( data['icon-cursor'] != 'auto' &&
						data['icon-cursor'] != curCursor) {
						// save the cursor before it's changed
						data['old-cursor'] = curCursor ? curCursor : 'auto';
						$this.data( 'iconfield', data );

						// change the cursor
						$this.css( 'cursor', data['icon-cursor'] );
					}
				} );

				// change the icon back to normal
				$this.on( 'iconfield.mouseleave', function( e ) {
					var data = $this.data( 'iconfield' );

					// 'auto' means that no special cursor was specified by the user,
					// meaning that there is nothing to change back to
					if( data['icon-cursor'] != 'auto' ) {
						// if no old cursor was stored (meaning that the mouse was never on the icon)
						// change back to 'auto'
						$this.css( 'cursor', data['old-cursor'] ? data['old-cursor'] : 'auto' );
					}
				} );

				// refresh the styling
				$this.iconfield( 'refresh' )

			} );

		},

		option : function( name, value ) {

			return $.access( this, function( elem, name, value ) {
				var $this = $(elem),
					data = $this.data('iconfield');

				if( value !== undefined ) {
					data[name] = value;
				} else {
					return data[name];
				}
			}, name, value, arguments.length > 1 );

		}
	}

	$.fn.iconfield = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}
		else {
			$.error( 'Method ' + method + ' does not exist on jQuery.iconfield' );
		}
	}

})(jQuery);
