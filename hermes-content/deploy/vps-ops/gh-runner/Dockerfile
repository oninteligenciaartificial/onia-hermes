# Runner self-hosted de GitHub Actions para los repos PRIVADOS de Onia.
#
# POR QUE EXISTE. El 2026-09-27 la cuenta GitHub Free agoto los 2.000 min/mes de
# Actions y todo job murio en 3 s sin runner ("recent account payments have
# failed or your spending limit needs to be increased"): master de platform
# quedo ROJO con el codigo sano y el release del QR + icono no tenia gate. Un
# runner propio no consume minutos. Aprobado por Sergio Urcullo el 28-sep.
#
# Sin socket de Docker a proposito: montarlo equivale a root en el VPS. El CI de
# platform solo necesita node; el escaneo de secretos baja gitleaks verificado
# por sha256 en vez de `docker run`.
FROM ubuntu:24.04

ARG RUNNER_VERSION=2.337.0
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ca-certificates curl git jq tar unzip zip xz-utils openssh-client \
      python3 make g++ tini \
 && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1001 -s /bin/bash runner

# El tarball llega verificado: instalar.sh compara su sha256 contra el publicado
# en las notas del release ANTES de construir esta imagen.
COPY actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz /tmp/runner.tgz
RUN mkdir -p /home/runner/actions-runner \
 && tar xzf /tmp/runner.tgz -C /home/runner/actions-runner \
 && rm /tmp/runner.tgz \
 && /home/runner/actions-runner/bin/installdependencies.sh \
 && rm -rf /var/lib/apt/lists/* \
 && chown -R runner:runner /home/runner

COPY --chmod=755 entrypoint.sh /usr/local/bin/entrypoint.sh

USER runner
WORKDIR /home/runner/actions-runner
ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/entrypoint.sh"]
