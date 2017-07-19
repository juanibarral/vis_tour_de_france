
from scrapy.shell import inspect_response
from scrapy.spiders import CrawlSpider
from scrapy.http import Request, FormRequest
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import Rule

import time
import scrapy

class APHCrawler(scrapy.Spider):
    name = 'inshea_crawler'
    allowed_domains = ['http://www.letour.fr/']
    # login_page = 'http://imagelibrary.aph.org/aphb/'
    # start_urls = ['http://www.letour.fr/le-tour/2017/us/1200/classement/bloc-classement-page/ITG.html']
    page = 1
    rate = 1
    CURRENT_STAGE = 12

    def __init__(self):
        scrapy.Spider.__init__(self)
        self.download_delay = 1/float(self.rate)

    def start_requests(self):
        """This function is called before crawling starts."""
        for i in range(self.CURRENT_STAGE):
          url = 'http://www.letour.fr/le-tour/2017/us/%d00/classement/bloc-classement-page/ITG.html'%i
          req = Request(url=url,
            callback=self.parseStage)
          req.meta["stage"] = i
          yield req
          self.logger.info('Sleeping stage %d' %i )
          time.sleep(self.download_delay)

    def parseStage(self, response):
        self.logger.info('Parse Stage %s', response.url)

        riders = []
        for rider in response.css("tr")[1:]:
            riders.append(self.parseRider(response, rider))
        stage = {
          'stage': response.meta["stage"],
          'distance': response.css("span.table--legend--km::text").extract()[0].strip(),
          'results': riders
        }
        yield stage

    def parseRider(self, response, rider):

        res = {
            'rank': rider.css("td:nth-child(1)::text").extract()[0].strip(),
            'rider': rider.css("td:nth-child(2) a::text").extract()[0].strip(),
            'riderNo': rider.css("td:nth-child(3)::text").extract()[0].strip(),
            'team': rider.css("td:nth-child(4) a::text").extract()[0].strip(),
            'times': rider.css("td:nth-child(5)::text").extract()[0].strip(),
            'gap': rider.css("td:nth-child(6)::text").extract()[0].strip(),

        }
        return res
