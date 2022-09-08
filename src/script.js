const scrollSizeUp = () => {
	// verifica o elemento
	const items = document.querySelectorAll('.js-scroll-size-img');
	if(items.length === 0) {
		return;
	}

	// normalização (converte qualquer intervalo para um valor entre 0 e 1)
	// valor: valor alvo, min: limite inferior, max: limite superior
	const norm = (value, min, max) => {
		return (value - min) / (max - min);
	}

	// interpolação linear (passar um intervalo e uma porcentagem retorna o valor nessa posição percentual)
	// min: limite inferior, max: limite superior, ratio: ratio
	const lerp = (min, max, ratio) => {
		return min + (max - min) * ratio;
	}


	// Grampo (ajuste para que o valor não ultrapasse o intervalo do valor mínimo e do valor máximo)
	// valor: valor alvo, min: limite inferior, max: limite superior
	const clamp = (value, min, max) => {
		return Math.max(Math.min(value, max), min);
	}

	// Usado para definir a posição inicial da altura da tela
	let winHeight = window.innerHeight;
	window.addEventListener('resize', () => {
		winHeight = window.innerHeight;
	});

	items.forEach(item => {
		// Obtém o elemento pai que serve como referência para a posição
		const parent = item.closest('.js-scroll-size-up-img');

		const move = () => {
			// verifica o elemento pai
			if(!parent) {
				return;
			}
			item.style.willChange = 'margin';
			requestAnimationFrame(() => {

				// obtém a posição base do elemento pai
				const parentRect = parent.getBoundingClientRect();
				const parentRectLeft = parentRect.left;
				const parentRectTop = parentRect.top;

				// Inicia o processamento quando o elemento estiver visível no 1/4 inferior da tela
				const startPosition = parentRectTop - (winHeight * 3 / 4);

				const getNorm = norm(0, startPosition, parentRectTop);
				let setPosition = lerp(0, parentRectLeft, getNorm);
				// Obtém o valor no intervalo do valor mínimo ao valor máximo
				setPosition = clamp(setPosition, 0, parentRectLeft);

				item.style.marginLeft = -setPosition + 'px';
				item.style.marginRight = -setPosition + 'px';
			});
			item.style.willChange = '';
		}
		// Inicialização
		move();

		/*
			O processamento começa quando um elemento entra na tela
		*/
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if(entry.isIntersecting) {
					move();
					// Adicione apenas elementos visíveis na tela para rolar eventos
					window.addEventListener('scroll', move, {passive: true});
				} else {
					// Exclui evento de rolagem quando estiver fora da tela
					window.removeEventListener('scroll', move, {passive: true});
				}
			});
		});

		// Adiciona o elemento pai para observação
		observer.observe(item);
	});
}

scrollSizeUp();