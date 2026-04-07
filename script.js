const imageSources = [
	'assets/fishnet_manufacturing_1.jpg',
	'assets/fishnet_manufacturing_2.jpg',
	'assets/fishnet_manufacturing_3.jpg',
	'assets/fishnet_manufacturing_4.jpg',
	'assets/fishnet_manufacturing_5.jpg',
	'assets/fishnet_manufacturing_6.jpg'
];

const processSteps = [
	{
		title: 'High-Grade Raw Material Selection',
		description: 'Premium-grade PE compounds are carefully selected and tested to ensure long-term durability, dimensional stability, and dependable pressure performance in every pipe.',
		points: ['PE100 grade material', 'Optimal molecular weight distribution'],
		image: 'assets/fishnet_manufacturing_1.jpg',
		alt: 'High grade raw material selection process'
	},
	{
		title: 'Precision Extrusion Control',
		description: 'Advanced extrusion lines maintain stable melt temperature, output consistency, and wall distribution to meet demanding dimensional tolerances.',
		points: ['Digitally controlled melt temperature', 'Uniform wall thickness across the profile', 'Continuous throughput monitoring'],
		image: 'assets/fishnet_manufacturing_2.jpg',
		alt: 'Precision extrusion process'
	},
	{
		title: 'Controlled Cooling and Haul-Off',
		description: 'The pipe is gradually cooled to avoid residual stress while synchronized haul-off systems maintain line speed and dimensional consistency.',
		points: ['Progressive cooling stages', 'Reduced internal stress', 'Synchronized puller control'],
		image: 'assets/fishnet_manufacturing_3.jpg',
		alt: 'Controlled cooling and haul-off'
	},
	{
		title: 'Vacuum Sizing and Calibration',
		description: 'Vacuum sizing tanks stabilize the outer diameter while internal pressure and cooling settings preserve roundness and dimensional accuracy.',
		points: ['Accurate OD control', 'Improved surface finish', 'Maintained circularity across the line'],
		image: 'assets/fishnet_manufacturing_4.jpg',
		alt: 'Vacuum sizing and calibration'
	},
	{
		title: 'Inline Quality Assurance',
		description: 'Multiple inline checks verify diameter, wall thickness, appearance, and traceability before the pipe moves to cutting or coiling.',
		points: ['Wall thickness verification', 'Surface inspection at line speed', 'Batch traceability and marking checks'],
		image: 'assets/fishnet_manufacturing_5.jpg',
		alt: 'Inline quality assurance'
	},
	{
		title: 'Inline Marking and Traceability',
		description: 'Continuous inkjet or embossing systems print product details, batch codes, and compliance marks directly on the pipe surface for full traceability.',
		points: ['Permanent product identification marking', 'Standard-compliant date and batch coding', 'Legible under field and storage conditions'],
		image: 'assets/fishnet_manufacturing_6.jpg',
		alt: 'Inline marking process'
	},
	{
		title: 'Precision Cutting to Length',
		description: 'Automatic cutting systems produce clean, square cuts at programmed lengths while maintaining production speed and dimensional accuracy.',
		points: ['Programmable cut-to-length automation', 'Clean burr-free pipe ends', 'Minimal material waste per batch'],
		image: 'assets/fishnet_manufacturing_2.jpg',
		alt: 'Precision cutting process'
	},
	{
		title: 'Packaging and Dispatch',
		description: 'Finished pipes are coiled or bundled based on size, then labeled and packed for secure transport while preserving shape, finish, and product identity.',
		points: ['Coiling or bundling by diameter', 'Protective wrapping and packaging', 'Dispatch-ready labeling and documentation'],
		image: 'assets/fishnet_manufacturing_5.jpg',
		alt: 'Packaging and dispatch'
	}
];

const stickyHeader = document.querySelector('.scroll-header');
const heroSection = document.getElementById('hero');
const mainImage = document.getElementById('mainGalleryImage');
const galleryFigure = document.getElementById('galleryMainFigure');
const galleryMainWrap = document.querySelector('.gallery-main-wrap');
const zoomLens = document.getElementById('zoomLens');
const zoomPreview = document.getElementById('zoomPreview');
const thumbsContainer = document.getElementById('galleryThumbs');
const prevSlideButton = document.getElementById('prevSlide');
const nextSlideButton = document.getElementById('nextSlide');
const faqList = document.getElementById('faqList');
const applicationGrid = document.getElementById('applicationGrid');
const appsPrev = document.getElementById('appsPrev');
const appsNext = document.getElementById('appsNext');
const testimonialGrid = document.querySelector('.testimonial-grid');
const processTabs = Array.from(document.querySelectorAll('.process-tab'));
const processPanel = document.getElementById('processPanel');
const processTitle = document.getElementById('processTitle');
const processDescription = document.getElementById('processDescription');
const processPoints = document.getElementById('processPoints');
const processImage = document.getElementById('processImage');
const processPrev = document.getElementById('processPrev');
const processNext = document.getElementById('processNext');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalTriggers = Array.from(document.querySelectorAll('[data-modal-target]'));
const modals = Array.from(document.querySelectorAll('.modal'));
const modalCloseButtons = Array.from(document.querySelectorAll('[data-close-modal]'));

let activeIndex = 0;
let activeProcessIndex = 0;
let activeModal = null;
let lastFocusedElement = null;

const isDesktopZoom = () => window.innerWidth > 1200;

const getFocusableElements = (container) => Array.from(
	container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
).filter((element) => {
	if (!(element instanceof HTMLElement)) {
		return false;
	}

	return !element.hidden
		&& !element.hasAttribute('hidden')
		&& !element.closest('[hidden]')
		&& !element.hasAttribute('inert');
});

const focusTabByIndex = (tabs, index) => {
	const targetTab = tabs[index];
	if (!targetTab) {
		return;
	}

	targetTab.focus();
	targetTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
};

const handleHorizontalTabKeydown = (event, tabs, activeItemIndex, activateTab) => {
	if (!tabs.length) {
		return;
	}

	let nextIndex = activeItemIndex;

	switch (event.key) {
		case 'ArrowRight':
		case 'Right':
			nextIndex = (activeItemIndex + 1) % tabs.length;
			break;
		case 'ArrowLeft':
		case 'Left':
			nextIndex = (activeItemIndex - 1 + tabs.length) % tabs.length;
			break;
		case 'Home':
			nextIndex = 0;
			break;
		case 'End':
			nextIndex = tabs.length - 1;
			break;
		case 'Enter':
		case ' ':
			activateTab(activeItemIndex, true);
			event.preventDefault();
			return;
		default:
			return;
	}

	event.preventDefault();
	activateTab(nextIndex, true);
};

const setActiveSlide = (index, shouldMoveFocus = false) => {
	activeIndex = (index + imageSources.length) % imageSources.length;
	const nextSrc = imageSources[activeIndex];

	mainImage.src = nextSrc;
	mainImage.alt = `HDPE pipe manufacturing image ${activeIndex + 1}`;
	zoomPreview.style.backgroundImage = `url(${nextSrc})`;

	Array.from(thumbsContainer.querySelectorAll('.thumb')).forEach((thumb, thumbIndex) => {
		const isActive = thumbIndex === activeIndex;
		thumb.classList.toggle('active', isActive);
		thumb.setAttribute('aria-selected', isActive ? 'true' : 'false');
		thumb.tabIndex = isActive ? 0 : -1;

		if (isActive) {
			galleryFigure?.setAttribute('aria-labelledby', thumb.id);
			if (shouldMoveFocus) {
				thumb.focus();
			}
		}
	});
};

const createThumbnails = () => {
	thumbsContainer.innerHTML = '';
	const thumbFragment = document.createDocumentFragment();

	imageSources.forEach((source, index) => {
		const thumbButton = document.createElement('button');
		thumbButton.type = 'button';
		thumbButton.className = 'thumb';
		thumbButton.id = `gallery-tab-${index}`;
		thumbButton.setAttribute('role', 'tab');
		thumbButton.setAttribute('aria-selected', 'false');
		thumbButton.setAttribute('aria-controls', 'galleryMainFigure');
		thumbButton.setAttribute('aria-label', `View image ${index + 1}`);
		thumbButton.tabIndex = -1;

		const img = document.createElement('img');
		img.src = source;
		img.alt = `Thumbnail ${index + 1}`;

		thumbButton.appendChild(img);
		thumbButton.addEventListener('click', () => setActiveSlide(index));
		thumbButton.addEventListener('keydown', (event) => {
			const tabs = Array.from(thumbsContainer.querySelectorAll('.thumb'));
			handleHorizontalTabKeydown(event, tabs, index, (nextIndex, shouldFocus) => {
				setActiveSlide(nextIndex, shouldFocus);
			});
		});
		thumbFragment.appendChild(thumbButton);
	});

	thumbsContainer.appendChild(thumbFragment);
};

const onImageHoverMove = (event) => {
	if (!isDesktopZoom()) {   // Zoom works only on desktop screens > 1200px
		return;
	}

	const imageRect = mainImage.getBoundingClientRect();
	const x = event.clientX - imageRect.left;
	const y = event.clientY - imageRect.top;
	const lensHalf = zoomLens.offsetWidth / 2;
	const lensX = Math.max(lensHalf, Math.min(imageRect.width - lensHalf, x));
	const lensY = Math.max(lensHalf, Math.min(imageRect.height - lensHalf, y));

	const naturalWidth = mainImage.naturalWidth || imageRect.width;
	const naturalHeight = mainImage.naturalHeight || imageRect.height;
	const coverScale = Math.max(imageRect.width / naturalWidth, imageRect.height / naturalHeight);
	const displayedWidth = naturalWidth * coverScale;
	const displayedHeight = naturalHeight * coverScale;
	const cropOffsetX = (displayedWidth - imageRect.width) / 2;
	const cropOffsetY = (displayedHeight - imageRect.height) / 2;

	const zoomScaleX = zoomPreview.offsetWidth / zoomLens.offsetWidth;
	const zoomScaleY = zoomPreview.offsetHeight / zoomLens.offsetHeight;
	const focusX = (lensX + cropOffsetX) * zoomScaleX;
	const focusY = (lensY + cropOffsetY) * zoomScaleY;
	const backgroundWidth = displayedWidth * zoomScaleX;
	const backgroundHeight = displayedHeight * zoomScaleY;
	const backgroundPosX = -(focusX - zoomPreview.offsetWidth / 2);
	const backgroundPosY = -(focusY - zoomPreview.offsetHeight / 2);

	zoomPreview.style.backgroundSize = `${backgroundWidth}px ${backgroundHeight}px`;
	zoomPreview.style.backgroundPosition = `${backgroundPosX}px ${backgroundPosY}px`;
	zoomLens.style.left = `${lensX}px`;
	zoomLens.style.top = `${lensY}px`;
};

const handleStickyHeader = () => {
	if (!stickyHeader || !heroSection) {
		return;
	}

	const heroRect = heroSection.getBoundingClientRect();
	const shouldShowStickyHeader = window.scrollY > 120 && heroRect.bottom < window.innerHeight - 120;

	stickyHeader.classList.toggle('active', shouldShowStickyHeader);
	stickyHeader.setAttribute('aria-hidden', shouldShowStickyHeader ? 'false' : 'true');
	stickyHeader.toggleAttribute('inert', !shouldShowStickyHeader);
};

const setupFaqAccordion = () => {
	if (!faqList) {
		return;
	}

	const faqItems = Array.from(faqList.querySelectorAll('details'));
	faqItems.forEach((item) => {
		item.addEventListener('toggle', () => {
			if (!item.open) {
				return;
			}

			faqItems.forEach((otherItem) => {
				if (otherItem !== item) {
					otherItem.open = false;
				}
			});
		});
	});
};

const scrollApplications = (direction) => {
	if (!applicationGrid) {
		return;
	}

	const firstCard = applicationGrid.querySelector('.application-card');
	if (!firstCard) {
		return;
	}

	const gridStyles = window.getComputedStyle(applicationGrid);
	const cardGap = parseFloat(gridStyles.columnGap || gridStyles.gap || '0') || 0;
	const cardWidth = firstCard.getBoundingClientRect().width + cardGap;
	applicationGrid.scrollBy({
		left: cardWidth * direction,
		behavior: 'smooth'
	});
};

const enableWheelHorizontalScroll = (element) => {
	if (!element) {
		return;
	}

	element.addEventListener('wheel', (event) => {
		const hasHorizontalOverflow = element.scrollWidth > element.clientWidth;
		if (!hasHorizontalOverflow) {
			return;
		}

		const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
			? event.deltaX
			: event.deltaY;

		if (horizontalDelta === 0) {
			return;
		}

		event.preventDefault();
		element.scrollBy({
			left: horizontalDelta,
			behavior: 'smooth'
		});
	}, { passive: false });
};

const renderProcessStep = (index) => {
	activeProcessIndex = (index + processSteps.length) % processSteps.length;
	const step = processSteps[activeProcessIndex];

	if (!step) {
		return;
	}

	processTitle.textContent = step.title;
	processDescription.textContent = step.description;
	processImage.src = step.image;
	processImage.alt = step.alt;
	processPoints.innerHTML = '';

	step.points.forEach((point) => {
		const item = document.createElement('li');
		item.textContent = point;
		processPoints.appendChild(item);
	});

	processTabs.forEach((tab, tabIndex) => {
		const isActive = tabIndex === activeProcessIndex;
		tab.classList.toggle('active', isActive);
		tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
		tab.tabIndex = isActive ? 0 : -1;

		if (isActive) {
			processPanel?.setAttribute('aria-labelledby', tab.id);
		}
	});
};

const closeAllModals = () => {
	modals.forEach((modal) => {
		modal.hidden = true;
	});
	modalBackdrop.hidden = true;
	document.body.classList.remove('modal-open');
	activeModal = null;

	if (lastFocusedElement && lastFocusedElement.isConnected) {
		lastFocusedElement.focus();
	}

	lastFocusedElement = null;
};

const openModal = (modalId) => {
	const targetModal = document.getElementById(modalId);
	if (!targetModal) {
		return;
	}

	modals.forEach((modal) => {
		modal.hidden = modal !== targetModal;
	});

	lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
	modalBackdrop.hidden = false;
	targetModal.hidden = false;
	document.body.classList.add('modal-open');
	activeModal = targetModal;

	const focusableElements = getFocusableElements(targetModal);
	const firstFocusableElement = focusableElements[0];
	if (firstFocusableElement) {
		firstFocusableElement.focus();
	}
};

createThumbnails();
setActiveSlide(0);
setupFaqAccordion();
renderProcessStep(0);
handleStickyHeader();

prevSlideButton?.addEventListener('click', () => setActiveSlide(activeIndex - 1));
nextSlideButton?.addEventListener('click', () => setActiveSlide(activeIndex + 1));

if (galleryFigure && galleryMainWrap) {
	galleryFigure.addEventListener('mouseenter', () => {
		if (isDesktopZoom()) {
			galleryMainWrap.classList.add('zooming');
		}
	});

	galleryFigure.addEventListener('mouseleave', () => {
		galleryMainWrap.classList.remove('zooming');
	});

	galleryFigure.addEventListener('mousemove', onImageHoverMove);
}

appsPrev?.addEventListener('click', () => scrollApplications(-1));
appsNext?.addEventListener('click', () => scrollApplications(1));

enableWheelHorizontalScroll(applicationGrid);
enableWheelHorizontalScroll(testimonialGrid);

processTabs.forEach((tab, index) => {
	tab.addEventListener('click', () => renderProcessStep(index));
	tab.addEventListener('keydown', (event) => {
		handleHorizontalTabKeydown(event, processTabs, index, (nextIndex, shouldFocus) => {
			renderProcessStep(nextIndex);
			if (shouldFocus) {
				focusTabByIndex(processTabs, nextIndex);
			}
		});
	});
});

processPrev?.addEventListener('click', () => renderProcessStep(activeProcessIndex - 1));
processNext?.addEventListener('click', () => renderProcessStep(activeProcessIndex + 1));

modalTriggers.forEach((trigger) => {
	trigger.addEventListener('click', () => {
		const target = trigger.getAttribute('data-modal-target');
		if (target) {
			openModal(target);
		}
	});
});

modalCloseButtons.forEach((button) => {
	button.addEventListener('click', closeAllModals);
});

modalBackdrop?.addEventListener('click', closeAllModals);

modals.forEach((modal) => {
	modal.addEventListener('click', (event) => {
		if (event.target === modal) {
			closeAllModals();
		}
	});
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		closeAllModals();
		return;
	}

	if (event.key !== 'Tab' || !activeModal) {
		return;
	}

	const focusableElements = getFocusableElements(activeModal);
	if (!focusableElements.length) {
		event.preventDefault();
		return;
	}

	const firstFocusableElement = focusableElements[0];
	const lastFocusableElement = focusableElements[focusableElements.length - 1];

	if (event.shiftKey && document.activeElement === firstFocusableElement) {
		event.preventDefault();
		lastFocusableElement.focus();
		return;
	}

	if (!event.shiftKey && document.activeElement === lastFocusableElement) {
		event.preventDefault();
		firstFocusableElement.focus();
	}
});

window.addEventListener('scroll', handleStickyHeader, { passive: true });

window.addEventListener('resize', () => {
	handleStickyHeader();
	galleryMainWrap?.classList.remove('zooming');
});